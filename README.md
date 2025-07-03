# Dynamic Web Admin

A client-side only Svelte application that reads page definitions from YAML files and dynamically renders forms and widgets.

## Features

- **Client-side only**: No server-side dependencies when running in production
- **YAML Configuration**: Define pages, forms, and widgets in YAML files
- **Dynamic Forms**: Supports multiple input types (text, email, password, select, checkbox, radio, textarea, button)
- **Flexible Layouts**: Single, grid, and tabbed layouts for pages
- **Form Validation**: Built-in validation with custom error messages
- **Responsive Design**: Mobile-friendly interface
- **Theme Support**: Customizable colors and fonts

## Widget Types

The application supports the following widget types:

- **text**: Single-line text input
- **email**: Email input with validation
- **password**: Password input
- **number**: Numeric input
- **select**: Dropdown selection
- **checkbox**: Boolean checkbox
- **radio**: Radio button group
- **textarea**: Multi-line text input
- **button**: Action button

## Configuration Structure

The application reads from `public/config.yaml`:

```yaml
title: "Dynamic Web Admin"
theme:
  primaryColor: "#3b82f6"
  secondaryColor: "#64748b"
  fontFamily: "Inter, system-ui, sans-serif"

pages:
  - id: "user-management"
    title: "User Management"
    description: "Manage user accounts and permissions"
    layout: "tabs"  # single, grid, or tabs
    style:
      backgroundColor: "#f8fafc"
      padding: "2rem"
      maxWidth: "1200px"
    forms:
      - id: "user-registration"
        title: "User Registration"
        description: "Create a new user account"
        submitText: "Register User"
        onSubmit: "createUser"
        widgets:
          - id: "username"
            type: "text"
            label: "Username"
            placeholder: "Enter username"
            required: true
            validation:
              min: 3
              max: 20
              pattern: "^[a-zA-Z0-9_]+$"
              message: "Username must be 3-20 characters"
            style:
              width: "100%"
              className: "form-input"
```

## Widget Configuration

Each widget supports the following properties:

- **id**: Unique identifier (required)
- **type**: Widget type (required)
- **label**: Display label
- **placeholder**: Placeholder text
- **required**: Whether the field is required
- **options**: Array of options for select/radio widgets
- **validation**: Validation rules
  - **min**: Minimum length/value
  - **max**: Maximum length/value
  - **pattern**: Regex pattern
  - **message**: Custom error message
- **style**: Styling options
  - **width**: Width (e.g., "100%")
  - **height**: Height (e.g., "100px")
  - **className**: CSS class name

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── lib/
│   ├── Widget.svelte      # Dynamic widget component
│   ├── Form.svelte        # Form container component
│   └── Page.svelte        # Page layout component
├── services/
│   └── configLoader.ts    # YAML configuration loader
├── types/
│   └── index.ts          # TypeScript interfaces
├── App.svelte            # Main application component
└── main.ts              # Application entry point

public/
└── config.yaml          # Application configuration
```

## API Integration

The application is designed to work with external API servers. Form submissions are handled in the `handleFormSubmit` function in `App.svelte`. You can modify this function to send data to your API server:

```typescript
function handleFormSubmit(event: CustomEvent) {
  const { pageId, formId, values, action } = event.detail;
  
  // Send to your API server
  fetch('/api/forms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pageId,
      formId,
      values,
      action
    })
  });
}
```

## Customization

### Adding New Widget Types

1. Add the new type to the `Widget` interface in `src/types/index.ts`
2. Implement the widget rendering logic in `src/lib/Widget.svelte`
3. Add appropriate styling

### Custom Styling

The application uses CSS custom properties for theming. You can override these in your YAML configuration:

```yaml
theme:
  primaryColor: "#your-color"
  secondaryColor: "#your-secondary-color"
  fontFamily: "Your Font, sans-serif"
```

### Form Actions

Each form can specify an `onSubmit` action that will be passed to your API server. Common actions include:
- `createUser`
- `updateUser`
- `deleteUser`
- `searchUsers`
- `saveSettings`

## Browser Compatibility

The application uses modern web APIs and is compatible with:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License
# dxlib_webui
