# 7de Yedi Vale - Production Deployment Guide

## Pre-Deployment Checklist ✅

### Security & Authentication

- ✅ Public registration removed completely for security
- ✅ Admin-only user creation via `/users` endpoints
- ✅ JWT secrets configured in production environment
- ✅ Role-based access control implemented
- ✅ Rate limiting configured (5 attempts, 15 min lockout)

### Environment Configuration

- ✅ Production `.env` file configured
- ✅ Database connection string ready
- ✅ CORS origins properly set
- ✅ JWT secrets and expiration configured
- ✅ Rate limiting parameters set

### Code Quality

- ✅ Debug logs removed from production code
- ✅ Error boundaries implemented (SafeComponent)
- ✅ Health check endpoint available at `/health`
- ✅ Production build scripts verified
- ✅ Node.js version requirements specified (>=18.0.0)

### Database

- ✅ Migration files ready in `api/src/database/migrations/`
- ✅ TypeORM configuration complete
- ✅ Database seeder ready for admin user creation

## Production Environment Variables

Create `.env.production` file in both `api/` and `www/` directories:

### API Environment (.env.production)

```env
NODE_ENV=production
PORT=3001

# Database (Replace with production database URL)
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=yedi_production

# JWT (Generate secure secrets for production)
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15

# CORS (Replace with your production domain)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend Environment (.env.production)

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Deployment Commands

### 1. Backend Deployment

```bash
cd api
npm install --production
npm run build
npm run migration:run
npm run seed:run  # Creates admin user
npm run start:prod
```

### 2. Frontend Deployment

```bash
cd www
npm install --production
npm run build
npm start
```

## Default Admin User

After running database seeder:

- **Email**: dev@gmail.com
- **Password**: 123456789
- **Role**: admin

⚠️ **IMPORTANT**: Change default admin credentials immediately after first login!

## Health Check

- **Endpoint**: `GET /health`
- **Response**: Application status, uptime, environment info
- **Use**: For monitoring and load balancer health checks

## Hosting Platform Options

### 1. DigitalOcean App Platform

- Easy deployment with Git integration
- Automatic SSL certificates
- Built-in database hosting
- Cost: ~$12-25/month

### 2. AWS (EC2 + RDS)

- Full control over infrastructure
- Scalable and reliable
- Requires more configuration
- Cost: ~$20-50/month

### 3. Vercel (Frontend) + Railway (Backend)

- Vercel for Next.js frontend
- Railway for NestJS API
- Simple deployment process
- Cost: ~$10-20/month

### 4. Heroku (if still available)

- Simple Git-based deployment
- Built-in PostgreSQL addon
- Easy environment variable management
- Cost: ~$15-30/month

## Post-Deployment Steps

1. **Verify Health Check**: `curl https://api.yourdomain.com/health`
2. **Test Admin Login**: Login with default credentials
3. **Change Admin Password**: Update admin user immediately
4. **Create Production Users**: Use admin interface to create users
5. **Monitor Logs**: Check application logs for any errors
6. **Setup Monitoring**: Consider adding Sentry or similar error tracking

## Production Ready! 🚀

Your application is now fully configured and ready for production deployment. Choose your hosting platform and follow the deployment commands above.

**Security Note**: All public registration has been removed. Only admins can create new users through the secure `/users` endpoints.
