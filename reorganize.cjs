const fs = require('fs');
const path = require('path');

const pagesDir = path.join(process.cwd(), 'src', 'pages');
const adminDir = path.join(pagesDir, 'admin');
const clientDir = path.join(pagesDir, 'client');
const employeeDir = path.join(pagesDir, 'employee');
const authDir = path.join(pagesDir, 'auth');
const routesDir = path.join(process.cwd(), 'src', 'routes');

[adminDir, clientDir, employeeDir, authDir, routesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const filesToMove = {
  'AdminAuditPage.tsx': adminDir,
  'AdminDataManagementPage.tsx': adminDir,
  'AdminInventoryPage.tsx': adminDir,
  'AdminOperationPage.tsx': adminDir,
  'AdminPaymentsPage.tsx': adminDir,
  'AdminSettingsPage.tsx': adminDir,
  'AdminSystemMonitoringPage.tsx': adminDir,
  'AdminUsersPage.tsx': adminDir,
  'BackupsPage.tsx': adminDir,
  'DashboardPage.tsx': adminDir,
  'ReportsPage.tsx': adminDir,
  
  'AboutPage.tsx': clientDir,
  'CatalogPage.tsx': clientDir,
  'ClientHomePage.tsx': clientDir,
  'CustomerOrdersPage.tsx': clientDir,
  'HomePage.tsx': clientDir,
  'ProductPage.tsx': clientDir,
  'TestimonialsPage.tsx': clientDir,
  
  'OrdersPage.tsx': employeeDir,
  'OrderDetailPage.tsx': employeeDir,
  'ProductManagementPage.tsx': employeeDir,
  
  'LoginPage.tsx': authDir,
  'RegisterPage.tsx': authDir,
};

Object.entries(filesToMove).forEach(([file, destDir]) => {
  const srcPath = path.join(pagesDir, file);
  const destPath = path.join(destDir, file);
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    // Update imports from '../' to '../../'
    content = content.replace(/from\s+['\"]\.\.\//g, 'from \'../../');
    fs.writeFileSync(destPath, content);
    fs.unlinkSync(srcPath);
    console.log('Moved and updated', file);
  }
});

// Move AnimatedRoutes.tsx to src/routes/AppRoutes.tsx
const routesSrc = path.join(process.cwd(), 'src', 'components', 'AnimatedRoutes.tsx');
const routesDest = path.join(routesDir, 'AppRoutes.tsx');
if (fs.existsSync(routesSrc)) {
  let content = fs.readFileSync(routesSrc, 'utf8');
  
  // Update the imports for pages
  content = content.replace(/import (.*) from '\.\.\/pages\/(Admin.*|BackupsPage|DashboardPage|ReportsPage)'/g, 'import $1 from \'../pages/admin/$2\'');
  content = content.replace(/import (.*) from '\.\.\/pages\/(AboutPage|CatalogPage|ClientHomePage|CustomerOrdersPage|HomePage|ProductPage|TestimonialsPage)'/g, 'import $1 from \'../pages/client/$2\'');
  content = content.replace(/import (.*) from '\.\.\/pages\/(OrdersPage|OrderDetailPage|ProductManagementPage)'/g, 'import $1 from \'../pages/employee/$2\'');
  content = content.replace(/import (.*) from '\.\.\/pages\/(LoginPage|RegisterPage)'/g, 'import $1 from \'../pages/auth/$2\'');
  
  // Update PageTransition import
  content = content.replace(/import PageTransition from '\.\/PageTransition'/g, 'import PageTransition from \'../components/PageTransition\'');
  
  fs.writeFileSync(routesDest, content);
  fs.unlinkSync(routesSrc);
  console.log('Moved AnimatedRoutes.tsx');
}

// Update Layout.tsx to point to AppRoutes
const layoutPath = path.join(process.cwd(), 'src', 'components', 'Layout.tsx');
if (fs.existsSync(layoutPath)) {
  let content = fs.readFileSync(layoutPath, 'utf8');
  content = content.replace(/import AnimatedRoutes from '\.\/AnimatedRoutes';/g, 'import AnimatedRoutes from \'../routes/AppRoutes\';');
  fs.writeFileSync(layoutPath, content);
  console.log('Updated Layout.tsx');
}
