# @nulogy/icons

A comprehensive icon library with TypeScript support for the Nulogy Design System.

## Installation

```bash
npm install @nulogy/icons
# or
pnpm add @nulogy/icons
# or
yarn add @nulogy/icons
```

## Usage

### Basic Usage

```typescript
import { IconData } from '@nulogy/icons';
import icons from '@nulogy/icons';

// Get icon data
const homeIcon: IconData = icons.home;
console.log(homeIcon);
// { path: ["M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"], viewBox: "0 0 24 24" }
```

### TypeScript Support

```typescript
import type { IconData, IconName } from '@nulogy/icons';
import icons from '@nulogy/icons';

// Type-safe icon access
const iconName: IconName = 'home'; // ✅ Valid
const invalidIcon: IconName = 'invalid'; // ❌ TypeScript error

// Type-safe icon data
const iconData: IconData = icons[iconName];
```

### Available Icons

The package includes 74+ icons. Here are some examples:

- `home` - Home icon
- `user` - User profile icon
- `settings` - Settings/gear icon
- `search` - Search magnifying glass
- `close` - Close/X icon
- `edit` - Edit/pencil icon
- `delete` - Delete/trash icon
- `save` - Save/floppy disk icon
- `print` - Print icon
- `help` - Help/question mark icon

For a complete list, check the TypeScript definitions or explore the `IconName` type.

### Using with SVG Elements

```typescript
import icons from '@nulogy/icons';

function HomeIcon() {
  const icon = icons.home;
  
  return (
    <svg viewBox={icon.viewBox}>
      {icon.path.map((pathData, index) => (
        <path key={index} d={pathData} fill="currentColor" />
      ))}
    </svg>
  );
}
```

### Using with React

```tsx
import React from 'react';
import icons from '@nulogy/icons';
import type { IconName } from '@nulogy/icons';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  const icon = icons[name];
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      className={className}
      fill="currentColor"
    >
      {icon.path.map((pathData, index) => (
        <path key={index} d={pathData} />
      ))}
    </svg>
  );
}

// Usage
<Icon name="home" size={32} className="text-blue-500" />
```

## API Reference

### Types

#### `IconData`

```typescript
interface IconData {
  path: string[];    // Array of SVG path data strings
  viewBox: string;    // SVG viewBox attribute
}
```

#### `IconName`

A union type of all available icon names:

```typescript
type IconName = "home" | "user" | "settings" | "search" | ...;
```

### Exports

- `default` - The icons object containing all icon data
- `IconData` - TypeScript interface for icon data structure
- `IconName` - TypeScript union type for valid icon names

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Adding New Icons

1. Add your SVG file to the `assets/` directory
2. Run the build process to regenerate types
3. The new icon will be automatically available in the `IconName` type

## License

MIT © Nulogy

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our [GitHub repository](https://github.com/nulogy/nds).

## Support

- 📖 [Documentation](https://github.com/nulogy/nds/tree/main/packages/icons)
- 🐛 [Report Issues](https://github.com/nulogy/nds/issues)
- 💬 [Discussions](https://github.com/nulogy/nds/discussions)
