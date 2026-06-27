<template>
  <div class="nav-container">
    <div class="nav-section">
      <h4>Rendering Strategies</h4>
      <div class="nav-links">
        <NuxtLink to="/prerendered">prerendered</NuxtLink>
        <NuxtLink to="/ssr">SSR + CSR</NuxtLink>
        <NuxtLink to="/ssr-cached">SSR + CSR + caching</NuxtLink>
        <NuxtLink to="/csr">CSR</NuxtLink>
        <NuxtLink to="/csr-cached">CSR + caching</NuxtLink>
        <NuxtLink to="/isr">ISR</NuxtLink>
        <NuxtLink to="/isr-true">ISR (no TTL)</NuxtLink>
      </div>
    </div>
    
    <div class="nav-section">
      <h4>Fine-Grained Authorization</h4>
      <div class="nav-links">
        <NuxtLink to="/fga" class="fga-main">FGA Overview</NuxtLink>
        <NuxtLink to="/fga/rbac">RBAC</NuxtLink>
        <NuxtLink to="/fga/fgac">FGAC</NuxtLink>
        <NuxtLink to="/fga/collaboration">Collaboration</NuxtLink>
        <NuxtLink to="/fga/organization">Organization</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  display: grid;
  gap: 2rem;
  margin: 2rem 0;
}

.nav-section h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-links a {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.nav-links a:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.nav-links a.router-link-active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.nav-links a.fga-main {
  background: #059669;
  color: white;
  border-color: #059669;
  font-weight: 500;
}

.nav-links a.fga-main:hover {
  background: #047857;
  border-color: #047857;
}

@media (min-width: 768px) {
  .nav-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 767px) {
  .nav-links {
    flex-direction: column;
  }
  
  .nav-links a {
    text-align: center;
  }
}
</style>
