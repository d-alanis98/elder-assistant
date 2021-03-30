import { ContainerBuilder, YamlFileLoader } from 'node-dependency-injection';

//Environment
const env = process.env.NODE_ENV || 'dev';
const container = new ContainerBuilder();
const loader = new YamlFileLoader(container);


loader.load(`${__dirname}/application_${env}.yaml`);

export default container;