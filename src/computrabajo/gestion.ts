import { createBrowser } from "../config/browser.js";
import { COMPUTRABAJO_URL } from "../config/env.js";
import { convertirFecha } from "../utils/dateParser.js";
import { timeOut } from "../utils/helpers.js";
import { Job, Requirement, Search, Skill, syncDatabase } from "./db.js";

export async function scrapeComputrabajo() {
  // Sincronizar base de datos
  await syncDatabase();
  console.log("📊 Base de datos sincronizada.");

  const browser = await createBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(COMPUTRABAJO_URL, { waitUntil: "networkidle2" });

    let busqueda = "desarrollo Web";

    // Obtener o crear búsqueda en DB
    const search = await Search.findOrCreate({
      where: { search_term: busqueda },
      defaults: { search_term: busqueda, source: 'excel' }
    });
    const searchId = search[0].id;
    console.log(`🔍 Búsqueda registrada: ${busqueda} (ID: ${searchId})`);

    // BUSQUEDA DE CARGO O CATEGORIA
    await page.waitForSelector("#prof-cat-search-input");
    await page.type("#prof-cat-search-input", busqueda, { delay: 5 });

    // BOTÓN BUSCAR
    await page.waitForSelector("#search-button");
    await page.click("#search-button");
    await timeOut(3000);

    // EXTRAER DATOS BÁSICOS DE TODAS LAS OFERTAS
    const ofertas = await page.$$eval("article.box_offer", (articles) =>
      articles.map((article) => {
        const titulo = article.querySelector("h2 a")?.textContent?.trim() || "";
        const empresa = article.querySelector("p a.fc_base")?.textContent?.trim() || "";
        const ubicacion = article.querySelector("p.fs16.fc_base.mt5 span")?.textContent?.trim() || "";
        const salario = article.querySelector(".i_salary")?.parentElement?.textContent?.trim() || "";
        const fechaRaw = article.querySelector(".fs13.fc_aux.mt15")?.textContent?.trim() || "";
        const link = article.querySelector("h2 a")?.href || "";

        return { titulo, empresa, ubicacion, salario, fechaRaw, link };
      })
    );

    console.log(`🔎 Se encontraron ${ofertas.length} ofertas.`);

    // RECORRER CADA OFERTA Y EXTRAER INFO DETALLADA
    let resultadosDetallados = [];

    for (let oferta of ofertas) {
      try {
        const pageOferta = await browser.newPage();
        await pageOferta.goto(oferta.link, { waitUntil: "networkidle2" });

        // EXTRAER INFORMACIÓN DETALLADA DENTRO DE LA OFERTA
        const detalles = await pageOferta.evaluate(() => {
          const descripcion =
            document.querySelector("div.mb40.pb40.bb1 > p.mbB")?.innerText.trim() || "";

          const tags = Array.from(document.querySelectorAll("div.mbB span.tag.base.mb10"))
            .map((el) => el.innerText.trim());

          const contrato = tags.find((t) => t.toLowerCase().includes("contrato")) || "";
          const jornada = tags.find((t) => t.toLowerCase().includes("tiempo")) || "";

          const requerimientos = Array.from(
            document.querySelectorAll("ul.disc.mbB li")
          ).map((li) => li.innerText.trim());

          const aptitudes = Array.from(
            document.querySelectorAll("span[data-skill-id]")
          ).map((el) => el.innerText.trim());

          const palabrasClave =
            document.querySelector("p.fc_aux.fs13.mbB.mtB")?.innerText.replace("Palabras clave:", "").trim() || "";

          const fechaPublicacionRaw =
            document.querySelector("p.fc_aux.fs13:last-of-type")?.innerText.trim() || "";

          const linkAplicar =
            document.querySelector("a[data-href-offer-apply]")?.getAttribute("data-href-offer-apply") || "";

          return {
            descripcion,
            contrato,
            jornada,
            requerimientos,
            aptitudes,
            palabrasClave,
            fechaPublicacionRaw,
            linkAplicar,
          };
        });

        resultadosDetallados.push({
          ...oferta,
          fecha: convertirFecha(oferta.fechaRaw),                 
          fechaPublicacion: convertirFecha(detalles.fechaPublicacionRaw), 
          ...detalles,
        });

        await pageOferta.close();
      } catch (err) {
        console.error(`⚠️ Error extrayendo detalle de oferta: ${oferta.link}`, err);
      }
    }

    // Guardar ofertas en base de datos
    let savedCount = 0;
    for (const oferta of resultadosDetallados) {
      try {
        // Upsert job
        const [job, created] = await Job.upsert({
          searchId,
          title: oferta.titulo,
          company: oferta.empresa,
          location: oferta.ubicacion,
          salary: oferta.salario,
          raw_date: oferta.fechaRaw,
          publication_date: oferta.fechaPublicacion,
          description: oferta.descripcion,
          contract_type: oferta.contrato,
          schedule: oferta.jornada,
          keywords: oferta.palabrasClave,
          apply_link: oferta.linkAplicar,
          url: oferta.link,
        });

        const jobId = job.id;

        // Delete existing requirements and skills
        await Requirement.destroy({ where: { jobId } });
        await Skill.destroy({ where: { jobId } });

        // Insert new requirements
        for (const req of oferta.requerimientos) {
          await Requirement.create({
            jobId,
            description: req,
          });
        }

        // Insert new skills
        for (const skill of oferta.aptitudes) {
          await Skill.create({
            jobId,
            name: skill,
          });
        }

        savedCount++;
      } catch (err) {
        console.error(`⚠️ Error guardando oferta: ${oferta.link}`, err);
      }
    }

    console.log(`💾 ${savedCount} ofertas guardadas en la base de datos.`);

    // Mostrar JSON completo
    console.log("📌 Ofertas detalladas extraídas:");
    console.log(JSON.stringify(resultadosDetallados, null, 2));

  } catch (error) {
    console.error("Error scraping:", error);
  } finally {
    console.log("cerrando pagina...");
    await timeOut(10000);
    await browser.close();
  }
}
