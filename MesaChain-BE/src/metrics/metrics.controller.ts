import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as client from 'prom-client';

@Controller('metrics')
export class MetricsController {
  private readonly register: client.Registry;

  constructor() {
    // Create a Registry to register the metrics
    this.register = new client.Registry();

    // Add a default label which is added to all metrics
    this.register.setDefaultLabels({
      app: 'mesachain-backend'
    });

    // Enable the collection of default metrics
    client.collectDefaultMetrics({ register: this.register });

    // Create custom metrics
    this.createCustomMetrics();
  }

  private createCustomMetrics() {
    // HTTP request duration histogram
    const httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    });

    // HTTP request counter
    const httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    // Database connection pool metrics
    const dbConnectionsActive = new client.Gauge({
      name: 'db_connections_active',
      help: 'Number of active database connections'
    });

    // Business metrics
    const ordersTotal = new client.Counter({
      name: 'orders_total',
      help: 'Total number of orders processed',
      labelNames: ['status']
    });

    const reservationsTotal = new client.Counter({
      name: 'reservations_total', 
      help: 'Total number of reservations processed',
      labelNames: ['status']
    });

    const usersRegistered = new client.Counter({
      name: 'users_registered_total',
      help: 'Total number of registered users',
      labelNames: ['role']
    });

    // Register all metrics
    this.register.registerMetric(httpRequestDuration);
    this.register.registerMetric(httpRequestsTotal);
    this.register.registerMetric(dbConnectionsActive);
    this.register.registerMetric(ordersTotal);
    this.register.registerMetric(reservationsTotal);
    this.register.registerMetric(usersRegistered);
  }

  @Get()
  async getMetrics(@Res() res: Response) {
    try {
      res.set('Content-Type', this.register.contentType);
      const metrics = await this.register.metrics();
      res.end(metrics);
    } catch (error) {
      res.status(500).end('Error collecting metrics');
    }
  }

  // Method to get the registry instance for use in other parts of the app
  getRegistry(): client.Registry {
    return this.register;
  }
}