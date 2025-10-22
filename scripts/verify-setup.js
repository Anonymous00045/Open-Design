#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Open Design setup...\n');

const checks = [
  {
    name: 'Frontend package.json',
    path: 'package.json',
    required: true
  },
  {
    name: 'Backend package.json',
    path: 'backend/package.json',
    required: true
  },
  {
    name: 'Frontend environment',
    path: '.env.local',
    required: true
  },
  {
    name: 'Backend environment',
    path: 'backend/.env',
    required: true
  },
  {
    name: 'TypeScript config',
    path: 'tsconfig.json',
    required: true
  },
  {
    name: 'Backend TypeScript config',
    path: 'backend/tsconfig.json',
    required: true
  },
  {
    name: 'Tailwind config',
    path: 'tailwind.config.ts',
    required: true
  },
  {
    name: 'Next.js config',
    path: 'next.config.ts',
    required: true
  },
  {
    name: 'Docker Compose',
    path: 'docker-compose.yml',
    required: false
  },
  {
    name: 'Main layout',
    path: 'src/app/layout.tsx',
    required: true
  },
  {
    name: 'Main page',
    path: 'src/app/page.tsx',
    required: true
  },
  {
    name: 'Design store',
    path: 'src/store/useDesignStore.ts',
    required: true
  },
  {
    name: 'API client',
    path: 'src/lib/api.ts',
    required: true
  },
  {
    name: 'Backend server',
    path: 'backend/src/server.ts',
    required: true
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const fullPath = path.join(__dirname, '..', check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.name}`);
    passed++;
  } else {
    console.log(`${check.required ? '❌' : '⚠️'} ${check.name} ${check.required ? '(REQUIRED)' : '(OPTIONAL)'}`);
    if (check.required) failed++;
  }
});

console.log(`\n📊 Setup verification complete:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log(`\n🎉 Setup looks good! You can start development with:`);
  console.log(`   npm run dev (frontend)`);
  console.log(`   npm run dev:backend (backend)`);
} else {
  console.log(`\n⚠️ Some required files are missing. Please check the setup guide.`);
  process.exit(1);
}