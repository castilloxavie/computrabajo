import { createBrowser } from "../config/browser.js";
import { COMPUTRABAJO_URL } from "../config/env.js";
import { timeOut } from "../utils/helpers.js";

export async function scrapeComputrabajo() {
  const browser = await createBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(COMPUTRABAJO_URL, { waitUntil: "networkidle2" });

    let busqueda = "desarrollo Web";

    // BUSQUEDA DE CARGO O CATEGORIA
    await page.waitForSelector("#prof-cat-search-input");
    await page.type("#prof-cat-search-input", busqueda, { delay: 5 });

    // BUSCAR EMPLEO (BOTON)
    await page.waitForSelector("#search-button");
    await page.click("#search-button");
    await timeOut(2000);

    // CONTAR CUÁNTAS OFERTAS SE ENCONTRARON
    const ofertasCount = await page.$$eval(".box_offer", (ofertas) => ofertas.length);
    console.log(`🔎 Se encontraron ${ofertasCount} ofertas con la clase 'box_offer'.`);

    // EXTRAER DATOS PRINCIPALES DE TODAS LAS OFERTAS
    if (ofertasCount > 0) {
      const ofertas = await page.$$eval("article.box_offer", (articles) =>
        articles.map((article) => {
          const titulo = article.querySelector("h2 a")?.textContent?.trim() || "";
          const empresa = article.querySelector("p a.fc_base")?.textContent?.trim() || "";
          const ubicacion = article.querySelector("p.fs16.fc_base.mt5 span")?.textContent?.trim() || "";
          const salario = article.querySelector(".i_salary")?.parentElement?.textContent?.trim() || "";
          const fecha = article.querySelector(".fs13.fc_aux.mt15")?.textContent?.trim() || "";
          const link = article.querySelector("h2 a")?.href || "";

          return {
            titulo,
            empresa,
            ubicacion,
            salario,
            fecha,
            link,
          };
        })
      );

      // JSON
      console.log(JSON.stringify(ofertas, null, 2));
    } else {
      console.log("⚠️ No se encontraron ofertas con la clase 'box_offer'.");
    }

  } catch (error) {
    console.error("Error scraping:", error);
  } finally {
    console.log("cerrando pagina...");
    await timeOut(10000);
    await browser.close();
  }
}
