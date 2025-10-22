# 🚀 Deployment Guide

## Overview

This guide covers deploying Open Design to production environments, including cloud platforms, containerization, and infrastructure setup.

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
      - NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://mongo:27017/opendesign
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION}
      - AWS_S3_BUCKET=${AWS_S3_BUCKET}
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
      - MONGO_INITDB_DATABASE=opendesign
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

#### Production Environment Variables

Create `.env.prod`:

```env
# Application
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-mongo-password
MONGODB_URI=mongodb://admin:your-secure-mongo-password@mongo:27017/opendesign?authSource=admin
REDIS_PASSWORD=your-secure-redis-password
REDIS_URL=redis://:your-secure-redis-password@redis:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-256-bits
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-production-bucket

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

#### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:5000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/s;

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Upload routes with higher limits
        location /api/upload {
            limit_req zone=upload burst=5 nodelay;
            client_max_body_size 100M;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
            proxy_send_timeout 300s;
        }

        # WebSocket support
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### Deployment Commands

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Update deployment
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# Backup database
docker exec -it opendesign_mongo_1 mongodump --out /backup
docker cp opendesign_mongo_1:/backup ./backup
```

### 2. Cloud Platform Deployment

#### AWS Deployment

**Using AWS ECS with Fargate:**

1. **Create ECR Repositories:**
```bash
aws ecr create-repository --repository-name open-design-frontend
aws ecr create-repository --repository-name open-design-backend
```

2. **Build and Push Images:**
```bash
# Frontend
docker build -t open-design-frontend .
docker tag open-design-frontend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/open-design-frontend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/open-design-frontend:latest

# Backend
docker build -t open-design-backend ./backend
docker tag open-design-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/open-design-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/open-design-backend:latest
```

3. **ECS Task Definition:**
```json
{
  "family": "open-design",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/open-design-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "NEXT_PUBLIC_API_URL",
          "value": "https://api.yourdomain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/open-design",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "frontend"
        }
      }
    },
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/open-design-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "MONGODB_URI",
          "value": "mongodb://your-documentdb-cluster:27017/opendesign"
        },
        {
          "name": "REDIS_URL",
          "value": "redis://your-elasticache-cluster:6379"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:open-design/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/open-design",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ]
}
```

#### Google Cloud Platform

**Using Cloud Run:**

1. **Build and Deploy Frontend:**
```bash
gcloud builds submit --tag gcr.io/your-project/open-design-frontend
gcloud run deploy open-design-frontend \
  --image gcr.io/your-project/open-design-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

2. **Build and Deploy Backend:**
```bash
gcloud builds submit --tag gcr.io/your-project/open-design-backend ./backend
gcloud run deploy open-design-backend \
  --image gcr.io/your-project/open-design-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-env-vars MONGODB_URI=mongodb://your-mongo-instance \
  --set-env-vars REDIS_URL=redis://your-redis-instance
```

#### Vercel Deployment (Frontend Only)

For frontend-only deployment with external backend:

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Configure Environment Variables:**
```bash
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_WS_URL production
```

### 3. Database Setup

#### MongoDB Atlas (Recommended)

1. **Create Cluster:**
   - Go to MongoDB Atlas
   - Create new cluster
   - Configure network access
   - Create database user

2. **Connection String:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opendesign?retryWrites=true&w=majority
```

#### Self-hosted MongoDB

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use opendesign
db.createUser({
  user: "opendesign",
  pwd: "secure-password",
  roles: [{ role: "readWrite", db: "opendesign" }]
})
```

#### Redis Setup

**Redis Cloud (Recommended):**
- Sign up for Redis Cloud
- Create database
- Get connection string

**Self-hosted Redis:**
```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your-secure-password

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 4. SSL/TLS Configuration

#### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Custom SSL Certificate

```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate signing request
openssl req -new -key key.pem -out csr.pem

# Generate self-signed certificate (for testing)
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

## Monitoring & Logging

### Application Monitoring

#### Health Check Endpoints

```typescript
// backend/src/routes/health.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});

app.get('/health/detailed', async (req, res) => {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkS3(),
    checkExternalAPIs()
  ]);

  const status = checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy';
  
  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    checks: checks.map((check, index) => ({
      name: ['database', 'redis', 's3', 'external-apis'][index],
      status: check.status,
      error: check.status === 'rejected' ? check.reason.message : null
    }))
  });
});
```

#### Logging Configuration

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'open-design-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

### Performance Monitoring

#### Prometheus Metrics

```typescript
// backend/src/middleware/metrics.ts
import prometheus from 'prom-client';

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });
  
  next();
};

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

## Security Considerations

### Environment Security

```bash
# Secure file permissions
chmod 600 .env.prod
chmod 600 ssl/key.pem

# Firewall configuration
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Application Security

```typescript
// Security middleware
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"]
    }
  }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## Backup & Recovery

### Database Backup

```bash
#!/bin/bash
# backup-script.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
S3_BUCKET="your-backup-bucket"

# Create backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$DATE.tar.gz" "s3://$S3_BUCKET/mongodb/"

# Cleanup local files older than 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

# Cleanup S3 files older than 30 days
aws s3api list-objects-v2 --bucket "$S3_BUCKET" --prefix "mongodb/" \
  --query "Contents[?LastModified<='$(date -d '30 days ago' --iso-8601)'].Key" \
  --output text | xargs -I {} aws s3 rm "s3://$S3_BUCKET/{}"
```

### Automated Backups

```yaml
# docker-compose.backup.yml
version: '3.8'

services:
  backup:
    image: mongo:7
    volumes:
      - ./backup-script.sh:/backup-script.sh
      - backup_data:/backup
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    command: |
      sh -c "
        apt-get update && apt-get install -y awscli cron
        echo '0 2 * * * /backup-script.sh' | crontab -
        cron -f
      "

volumes:
  backup_data:
```

## Scaling Considerations

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  frontend:
    # ... frontend config
    deploy:
      replicas: 3

  backend:
    # ... backend config
    deploy:
      replicas: 5

  nginx:
    # ... nginx config with load balancing
    depends_on:
      - frontend
      - backend
```

### Load Balancing

```nginx
# nginx load balancing
upstream backend_servers {
    least_conn;
    server backend_1:5000;
    server backend_2:5000;
    server backend_3:5000;
    server backend_4:5000;
    server backend_5:5000;
}

upstream frontend_servers {
    server frontend_1:3000;
    server frontend_2:3000;
    server frontend_3:3000;
}
```

### Database Scaling

```javascript
// MongoDB replica set configuration
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
});
```

## Troubleshooting

### Common Issues

1. **Memory Issues:**
```bash
# Check memory usage
docker stats
free -h

# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096"
```

2. **Database Connection Issues:**
```bash
# Test MongoDB connection
mongo "$MONGODB_URI"

# Check MongoDB logs
docker logs opendesign_mongo_1
```

3. **SSL Certificate Issues:**
```bash
# Check certificate validity
openssl x509 -in cert.pem -text -noout

# Test SSL connection
openssl s_client -connect yourdomain.com:443
```

### Log Analysis

```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Search for errors
docker-compose logs backend | grep ERROR

# Monitor real-time logs
tail -f logs/combined.log | grep ERROR
```