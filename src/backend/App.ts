//Node modules
import { Definition } from 'node-dependency-injection';
//Dependency injection
import container from './dependency-injection';
//Server
import Server from './Server';
//Domain
import EventBus from '../application/Shared/domain/EventBus';
import DomainEvent from '../application/Shared/domain/DomainEvent';
import DomainEventSubscriber from '../application/Shared/domain/DomainEventSubscriber';
import DomainEventMapping from '../application/Shared/infrastructure/EventBus/DomainEventMapping';
//Configuration
import app from '../configuration/app';



export default class App {
    private server?: Server;

    async start() {
        const port: number | string = app.serverPort;
        //We set the server
        this.server = new Server(port);
        await this.registerSubscribers();
        return this.server.listen();
    }

    async stop() {
        return this.server?.stop();
    }

    get httpServer() {
        return this.server?.getHTTPServer();
    }

    private async registerSubscribers() {
        /*
        const eventBus = container.get('Shared.EventBus') as EventBus;
        const subscriberDefinitions = container.findTaggedServiceIds('domainEventSubscriber') as Map<String, Definition>;
        const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];

        subscriberDefinitions.forEach((value: any, key: any) => subscribers.push(container.get(key)));
        const domainEventMapping = new DomainEventMapping(subscribers);

        eventBus.setDomainEventMapping(domainEventMapping);
        eventBus.addSubscribers(subscribers);
        await eventBus.start();
        */
    }
}