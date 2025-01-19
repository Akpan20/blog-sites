import prometheus from 'prom-client';
import { WebClient } from '@slack/web-api';

// Initialize Slack client
const slackClient = new WebClient(process.env.SLACK_TOKEN);

// Initialize Prometheus metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const activeUsers = new prometheus.Gauge({
  name: 'active_users_total',
  help: 'Total number of active users',
});

// Monitoring middleware
export const performanceMonitor = async (req: any, res: any, next: () => void) => {
  const start = Date.now();
  const route = req.route?.path || req.path;

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    // Alert on slow requests
    if (duration > 5) {
      alertSlowRequest(req, duration);
    }
  });

  next();
};

// Alert functions
async function alertSlowRequest(req: any, duration: number) {
  const message = {
    channel: 'monitoring-alerts',
    text: `🚨 Slow Request Alert!\n
    Path: ${req.path}\n
    Duration: ${duration.toFixed(2)}s\n
    Method: ${req.method}\n
    User: ${req.user?.id || 'anonymous'}`,
  };

  await slackClient.chat.postMessage(message);
}
