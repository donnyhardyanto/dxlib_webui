<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Form from './Form.svelte';
  import type { Page } from '../types';

  export let page: Page;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  let activeTab = 0;

  function handleFormSubmit(event: CustomEvent) {
    const { formId, values, action } = event.detail;
    dispatch('formSubmit', { pageId: page.id, formId, values, action });
  }

  function handleFormError(event: CustomEvent) {
    const { formId, error } = event.detail;
    dispatch('formError', { pageId: page.id, formId, error });
  }

  function setActiveTab(index: number) {
    activeTab = index;
  }

  $: pageStyle = page.style ? 
    `background-color: ${page.style.backgroundColor || 'transparent'}; padding: ${page.style.padding || '2rem'}; max-width: ${page.style.maxWidth || 'none'};` : 
    undefined;
</script>

<div class="page-container" style={pageStyle}>
  <div class="page-header">
    <h2 class="page-title">{page.title}</h2>
    {#if page.description}
      <p class="page-description">{page.description}</p>
    {/if}
  </div>

  {#if page.layout === 'tabs' && page.forms.length > 1}
    <div class="tabs-container">
      <div class="tabs-header">
        {#each page.forms as form, index}
          <button
            class="tab-button {activeTab === index ? 'active' : ''}"
            on:click={() => setActiveTab(index)}
          >
            {form.title}
          </button>
        {/each}
      </div>
      
      <div class="tab-content">
        <Form
          form={page.forms[activeTab]}
          {disabled}
          on:submit={handleFormSubmit}
          on:error={handleFormError}
        />
      </div>
    </div>

  {:else if page.layout === 'grid' && page.forms.length > 1}
    <div class="grid-container">
      {#each page.forms as form}
        <div class="grid-item">
          <Form
            {form}
            {disabled}
            on:submit={handleFormSubmit}
            on:error={handleFormError}
          />
        </div>
      {/each}
    </div>

  {:else}
    <!-- Single layout or single form -->
    {#each page.forms as form}
      <Form
        {form}
        {disabled}
        on:submit={handleFormSubmit}
        on:error={handleFormError}
      />
    {/each}
  {/if}
</div>

<style>
  .page-container {
    min-height: 100vh;
    padding: 2rem;
  }

  .page-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .page-title {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
  }

  .page-description {
    margin: 0;
    color: #6b7280;
    font-size: 1rem;
    line-height: 1.6;
  }

  .tabs-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .tabs-header {
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 2rem;
  }

  .tab-button {
    padding: 1rem 2rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }

  .tab-button:hover {
    color: #374151;
  }

  .tab-button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .tab-content {
    min-height: 400px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .grid-item {
    min-height: 300px;
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 1rem;
    }

    .page-title {
      font-size: 1.5rem;
    }

    .tabs-header {
      flex-direction: column;
    }

    .tab-button {
      text-align: left;
      border-bottom: none;
      border-left: 2px solid transparent;
    }

    .tab-button.active {
      border-left-color: #3b82f6;
    }

    .grid-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style> 