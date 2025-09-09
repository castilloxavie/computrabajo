import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'computrabajo',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
    },
  }
);

// Search model
interface SearchAttributes {
  id: number;
  search_term: string;
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface SearchCreationAttributes extends Optional<SearchAttributes, 'id'> {}
class Search extends Model<SearchAttributes, SearchCreationAttributes> implements SearchAttributes {
  public id!: number;
  public search_term!: string;
  public source?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Search.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    search_term: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'excel',
    },
  },
  {
    sequelize,
    tableName: 'searches',
  }
);

// Job model
interface JobAttributes {
  id: number;
  searchId: number;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  raw_date?: string;
  publication_date?: string;
  description?: string;
  contract_type?: string;
  schedule?: string;
  keywords?: string;
  apply_link?: string;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface JobCreationAttributes extends Optional<JobAttributes, 'id'> {}
class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: number;
  public searchId!: number;
  public title!: string;
  public company?: string;
  public location?: string;
  public salary?: string;
  public raw_date?: string;
  public publication_date?: string;
  public description?: string;
  public contract_type?: string;
  public schedule?: string;
  public keywords?: string;
  public apply_link?: string;
  public url!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Job.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    searchId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Search,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company: DataTypes.STRING(255),
    location: DataTypes.STRING(255),
    salary: DataTypes.STRING(100),
    raw_date: DataTypes.STRING(100),
    publication_date: DataTypes.DATE,
    description: DataTypes.TEXT,
    contract_type: DataTypes.STRING(100),
    schedule: DataTypes.STRING(100),
    keywords: DataTypes.TEXT,
    apply_link: DataTypes.STRING(500),
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'jobs',
  }
);

// Requirement model
interface RequirementAttributes {
  id: number;
  jobId: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface RequirementCreationAttributes extends Optional<RequirementAttributes, 'id'> {}
class Requirement extends Model<RequirementAttributes, RequirementCreationAttributes> implements RequirementAttributes {
  public id!: number;
  public jobId!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Requirement.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Job,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'requirements',
  }
);

// Skill model
interface SkillAttributes {
  id: number;
  jobId: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface SkillCreationAttributes extends Optional<SkillAttributes, 'id'> {}
class Skill extends Model<SkillAttributes, SkillCreationAttributes> implements SkillAttributes {
  public id!: number;
  public jobId!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Skill.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Job,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'skills',
  }
);

// Associations
Search.hasMany(Job, { foreignKey: 'searchId', as: 'jobs' });
Job.belongsTo(Search, { foreignKey: 'searchId', as: 'search' });

Job.hasMany(Requirement, { foreignKey: 'jobId', as: 'requirements' });
Requirement.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

Job.hasMany(Skill, { foreignKey: 'jobId', as: 'skills' });
Skill.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

export async function syncDatabase() {
  await sequelize.sync({ alter: true });
}

export { sequelize, Search, Job, Requirement, Skill };
