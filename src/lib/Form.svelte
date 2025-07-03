<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Widget from './Widget.svelte';
  import type { Form } from '../types';

  export let form: Form;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  // Store form values
  let formValues: Record<string, any> = {};
  let isSubmitting = false;

  function handleWidgetChange(event: CustomEvent) {
    const { widgetId, value } = event.detail;
    formValues[widgetId] = value;
  }

  function handleWidgetSubmit(event: CustomEvent) {
    const { widgetId } = event.detail;
    
    // If it's a submit button, handle form submission
    const submitWidget = form.widgets.find(w => w.id === widgetId);
    if (submitWidget?.type === 'button') {
      handleFormSubmit();
    }
  }

  async function handleFormSubmit() {
    if (isSubmitting || disabled) return;

    isSubmitting = true;
    
    try {
      // Validate required fields
      const requiredWidgets = form.widgets.filter(w => w.required);
      const missingFields = requiredWidgets.filter(w => 
        formValues[w.id] === undefined || 
        formValues[w.id] === null || 
        formValues[w.id] === ''
      );

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.map(w => w.label || w.id).join(', ')}`);
      }

      // Dispatch form submission event
      dispatch('submit', {
        formId: form.id,
        values: formValues,
        action: form.onSubmit
      });

      // Reset form after successful submission
      formValues = {};
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch('error', { formId: form.id, error: errorMessage });
    } finally {
      isSubmitting = false;
    }
  }

  // Initialize form values
  $: {
    form.widgets.forEach(widget => {
      if (formValues[widget.id] === undefined) {
        formValues[widget.id] = widget.type === 'checkbox' ? false : '';
      }
    });
  }
</script>

<div class="form-container">
  <div class="form-header">
    <h3 class="form-title">{form.title}</h3>
    {#if form.description}
      <p class="form-description">{form.description}</p>
    {/if}
  </div>

  <form class="form-content" on:submit|preventDefault={handleFormSubmit}>
    {#each form.widgets as widget}
      <Widget
        {widget}
        value={formValues[widget.id]}
        {disabled}
        on:change={handleWidgetChange}
        on:submit={handleWidgetSubmit}
      />
    {/each}

    {#if form.submitText && !form.widgets.some(w => w.type === 'button')}
      <div class="form-actions">
        <button
          type="submit"
          class="btn-primary"
          disabled={isSubmitting || disabled}
        >
          {#if isSubmitting}
            Submitting...
          {:else}
            {form.submitText}
          {/if}
        </button>
      </div>
    {/if}
  </form>
</div>

<style>
  .form-container {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .form-header {
    margin-bottom: 1.5rem;
  }

  .form-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  .form-description {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .form-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-actions {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style> 