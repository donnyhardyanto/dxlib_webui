<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Widget } from '../types';

  export let widget: Widget;
  export let value: any = '';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    let newValue: any = target.value;

    // Handle checkbox and radio inputs
    if (target.type === 'checkbox') {
      newValue = (target as HTMLInputElement).checked;
    } else if (target.type === 'number') {
      newValue = target.value === '' ? null : Number(target.value);
    }

    value = newValue;
    dispatch('change', { widgetId: widget.id, value: newValue });
  }

  function handleSubmit() {
    dispatch('submit', { widgetId: widget.id });
  }

  function validateInput(event: Event) {
    const target = event.target as HTMLInputElement;
    
    if (widget.validation) {
      const { min, max, pattern } = widget.validation;
      
      if (min !== undefined && target.value.length < min) {
        target.setCustomValidity(widget.validation.message || `Minimum ${min} characters required`);
      } else if (max !== undefined && target.value.length > max) {
        target.setCustomValidity(widget.validation.message || `Maximum ${max} characters allowed`);
      } else if (pattern && !new RegExp(pattern).test(target.value)) {
        target.setCustomValidity(widget.validation.message || 'Invalid format');
      } else {
        target.setCustomValidity('');
      }
    }
  }

  $: inputId = `widget-${widget.id}`;
  $: inputClass = widget.style?.className || '';
</script>

<div class="widget-container">
  {#if widget.label && widget.type !== 'button'}
    <label for={inputId} class="widget-label">
      {widget.label}
      {#if widget.required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

  {#if widget.type === 'text' || widget.type === 'email' || widget.type === 'password' || widget.type === 'number'}
    <input
      id={inputId}
      type={widget.type}
      {value}
      placeholder={widget.placeholder}
      required={widget.required}
      {disabled}
      class={inputClass}
      on:input={handleInput}
      on:blur={validateInput}
    />

  {:else if widget.type === 'textarea'}
    <textarea
      id={inputId}
      {value}
      placeholder={widget.placeholder}
      required={widget.required}
      {disabled}
      class={inputClass}
      on:input={handleInput}
      on:blur={validateInput}
    ></textarea>

  {:else if widget.type === 'select'}
    <select
      id={inputId}
      {value}
      required={widget.required}
      {disabled}
      class={inputClass}
      on:change={handleInput}
    >
      {#if widget.placeholder}
        <option value="" disabled selected>{widget.placeholder}</option>
      {/if}
      {#each widget.options || [] as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>

  {:else if widget.type === 'checkbox'}
    <div class="checkbox-container">
      <input
        id={inputId}
        type="checkbox"
        checked={value}
        {disabled}
        class={inputClass}
        on:change={handleInput}
      />
      <label for={inputId} class="checkbox-label">
        {widget.label}
        {#if widget.required}
          <span class="required">*</span>
        {/if}
      </label>
    </div>

  {:else if widget.type === 'radio'}
    <div class="radio-container">
      {#each widget.options || [] as option}
        <div class="radio-option">
          <input
            id={`${inputId}-${option.value}`}
            type="radio"
            name={inputId}
            value={option.value}
            checked={value === option.value}
            {disabled}
            class={inputClass}
            on:change={handleInput}
          />
          <label for={`${inputId}-${option.value}`} class="radio-label">
            {option.label}
          </label>
        </div>
      {/each}
    </div>

  {:else if widget.type === 'button'}
    <button
      id={inputId}
      type="button"
      {disabled}
      class={inputClass}
      on:click={handleSubmit}
    >
      {widget.label || 'Submit'}
    </button>
  {/if}
</div>

<style>
  .widget-container {
    margin-bottom: 1rem;
  }

  .widget-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }

  .required {
    color: #ef4444;
    margin-left: 0.25rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .checkbox-container,
  .radio-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .checkbox-label,
  .radio-label {
    margin: 0;
    font-weight: 400;
    color: #374151;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .form-checkbox {
    width: 1rem;
    height: 1rem;
    accent-color: #3b82f6;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-secondary {
    background-color: #64748b;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #475569;
  }

  .btn-primary:disabled,
  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style> 