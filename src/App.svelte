<script lang="ts">
  import { onMount } from 'svelte';
  import { ConfigLoader } from './services/configLoader';
  import Page from './lib/Page.svelte';
  import type { AppConfig, Page as PageType } from './types';

  let config: AppConfig | null = null;
  let loading = true;
  let error: string | null = null;
  let currentPageIndex = 0;

  const configLoader = ConfigLoader.getInstance();

  onMount(async () => {
    try {
      config = await configLoader.loadConfig();
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load configuration';
      loading = false;
    }
  });

  function handleFormSubmit(event: CustomEvent) {
    const { pageId, formId, values, action } = event.detail;
    console.log('Form submitted:', { pageId, formId, values, action });
    
    // Here you would typically send the data to your API server
    // For now, we'll just show an alert
    alert(`Form "${formId}" submitted with action "${action}". Check console for values.`);
  }

  function handleFormError(event: CustomEvent) {
    const { pageId, formId, error: formError } = event.detail;
    console.error('Form error:', { pageId, formId, error: formError });
    alert(`Error in form "${formId}": ${formError}`);
  }

  function setPage(index: number) {
    currentPageIndex = index;
  }

  $: currentPage = config?.pages[currentPageIndex] || null;
  $: pageStyle = config?.theme ? 
    `--primary-color: ${config.theme.primaryColor || '#3b82f6'}; --secondary-color: ${config.theme.secondaryColor || '#64748b'}; --font-family: ${config.theme.fontFamily || 'Inter, system-ui, sans-serif'};` : 
    undefined;
</script>

<svelte:head>
  <title>{config?.title || 'Dynamic Web Admin'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<main style={pageStyle}>
  {#if loading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading configuration...</p>
    </div>

  {:else if error}
    <div class="error-container">
      <h2>Configuration Error</h2>
      <p>{error}</p>
      <button class="btn-primary" on:click={() => window.location.reload()}>
        Retry
      </button>
    </div>

  {:else if config}
    <div class="app-container">
      <!-- Navigation -->
      {#if config.pages.length > 1}
        <nav class="navigation">
          <div class="nav-container">
            <h1 class="app-title">{config.title}</h1>
            <div class="nav-tabs">
              {#each config.pages as page, index}
                <button
                  class="nav-tab {currentPageIndex === index ? 'active' : ''}"
                  on:click={() => setPage(index)}
                >
                  {page.title}
                </button>
              {/each}
            </div>
          </div>
        </nav>
      {/if}

      <!-- Page Content -->
      {#if currentPage}
        <Page
          page={currentPage}
          on:formSubmit={handleFormSubmit}
          on:formError={handleFormError}
        />
      {/if}
    </div>
  {/if}
</main>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: var(--font-family, 'Inter, system-ui, sans-serif');
    background-color: #f9fafb;
    color: #111827;
  }

  main {
    min-height: 100vh;
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid var(--primary-color, #3b82f6);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-container h2 {
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .error-container p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  .app-container {
    min-height: 100vh;
  }

  .navigation {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .app-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color, #3b82f6);
  }

  .nav-tabs {
    display: flex;
    gap: 0.5rem;
  }

  .nav-tab {
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }

  .nav-tab:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  .nav-tab.active {
    background-color: var(--primary-color, #3b82f6);
    color: white;
  }

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-color, #3b82f6);
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  .btn-primary:hover {
    background-color: #2563eb;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .nav-tabs {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .nav-tab {
      white-space: nowrap;
      flex-shrink: 0;
    }
  }
</style>
