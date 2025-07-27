# Table Layout Designer

Un diseñador de layout de tablas interactivo que permite crear y gestionar la disposición de mesas en un restaurante.

## Características

### ✨ Nuevas Mejoras Implementadas

#### 🎯 Posicionamiento Libre
- **Fondo de Cuadrícula**: El canvas ahora muestra una cuadrícula visual que ayuda al posicionamiento preciso
- **Posicionamiento Ilimitado**: Las tablas se pueden posicionar en cualquier lugar del tablero, no solo en zonas limitadas
- **Snap to Grid**: Las tablas se ajustan automáticamente a la cuadrícula para un posicionamiento preciso

#### 🎮 Controles Mejorados
- **Zoom Dinámico**: Control de zoom desde 30% hasta 200% con botones intuitivos
- **Tamaño de Cuadrícula Ajustable**: Opciones de 10px a 40px para diferentes niveles de precisión
- **Drag & Drop Mejorado**: Arrastre suave de tablas con indicadores visuales

#### 🎨 Interfaz de Usuario
- **Fondo de Cuadrícula Visual**: Patrón de líneas que muestra la cuadrícula de posicionamiento
- **Indicadores de Estado**: Las tablas muestran claramente su estado (disponible, reservada, ocupada)
- **Selección Intuitiva**: Click para seleccionar, click en canvas vacío para deseleccionar

## Funcionalidades

### Agregar Tablas
1. Arrastra una plantilla de tabla desde el panel izquierdo
2. Suelta en cualquier posición del canvas
3. La tabla se posicionará automáticamente en la cuadrícula más cercana

### Mover Tablas
1. Click y arrastra cualquier tabla
2. Las tablas se ajustan automáticamente a la cuadrícula
3. Suelta para confirmar la nueva posición

### Ajustar Vista
- **Zoom**: Usa los botones +/- para acercar o alejar
- **Cuadrícula**: Cambia el tamaño de la cuadrícula para mayor precisión
- **Scroll**: Navega por el canvas cuando hay muchas tablas

### Gestionar Tablas
- **Seleccionar**: Click en una tabla para seleccionarla
- **Editar**: Las tablas seleccionadas abren el panel de propiedades
- **Eliminar**: Usa el panel de propiedades para eliminar tablas

## Estructura de Archivos

```
TableLayoutDesigner/
├── index.tsx              # Componente principal
├── LayoutCanvas.tsx       # Canvas con posicionamiento libre
├── TableComponent.tsx     # Componente de tabla individual
├── ToolsPanel.tsx         # Panel de herramientas y controles
├── DraggableTableTemplate.tsx # Plantillas arrastrables
├── PropertiesPanel.tsx    # Panel de propiedades
└── Toast.tsx             # Notificaciones
```

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Zustand** para manejo de estado
- **Tailwind CSS** para estilos
- **CSS Grid** para el fondo de cuadrícula
- **Mouse Events** para drag & drop personalizado

## Estado del Store

```typescript
interface TableLayoutStore {
  tables: Table[];
  selectedTableId: string | null;
  isDragging: boolean;
  isResizing: boolean;
  zoom: number;           // 0.3 - 2.0
  gridSize: number;       // 10 - 40px
}
```

## Uso

```tsx
import { TableLayoutDesigner } from '@/components/TableLayoutDesigner';

function App() {
  return (
    <div className="h-screen">
      <TableLayoutDesigner />
    </div>
  );
}
```

## Próximas Mejoras

- [ ] Redimensionamiento de tablas
- [ ] Rotación de tablas
- [ ] Múltiples layouts guardados
- [ ] Exportar/importar layouts
- [ ] Vista previa en tiempo real
- [ ] Colaboración en tiempo real 