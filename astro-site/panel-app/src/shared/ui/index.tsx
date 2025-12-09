// Modern UI Components - Barrel Exports
import * as React from "react"
export { Button } from './button'

// Type definitions for improved type safety
type DivProps = React.HTMLAttributes<HTMLDivElement>;
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface BadgeProps extends DivProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface SwitchProps extends Omit<ButtonProps, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

interface SliderProps extends DivProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

interface SelectProps extends DivProps {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
}

interface SelectItemProps extends DivProps {
  value: string;
  onSelect?: (value: string) => void;
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
  value?: string;
}

interface TabsProps extends DivProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsListProps extends DivProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

interface TabsTriggerProps extends ButtonProps {
  value: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

interface TabsContentProps extends DivProps {
  value: string;
  activeTab?: string;
}

interface ModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DateRangeValue {
  from?: string;
  to?: string;
}

interface DateRangePickerProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  placeholder?: string;
}

// Fallback components for missing UI elements
export const Card: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm ${className || ''}`} {...props}>
    {children}
  </div>
)

export const CardHeader: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props}>
    {children}
  </div>
)

export const CardContent: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div className={`p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
)

export const CardFooter: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
)

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input 
      ref={ref}
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  }
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

// Simplified component stubs that work
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-primary' : 'bg-input'} ${className || ''}`}
      disabled={disabled}
      {...props}
    >
      <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
)
Switch.displayName = 'Switch'

export const Slider: React.FC<SliderProps> = ({ value = [0], onValueChange, min = 0, max = 100, step = 1, className, ...props }) => (
  <div className={`relative flex w-full touch-none select-none items-center ${className || ''}`} {...props}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className="flex-1 bg-transparent"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value[0]}
    />
  </div>
)

export const Select: React.FC<SelectProps> = ({ children, onValueChange, defaultValue, value, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || value || "")
  
  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }
  
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { onValueChange: handleChange, value: value || internalValue } as Record<string, unknown>)
          : child
      )}
    </div>
  )
}

export const SelectContent: React.FC<DivProps> = ({ children, ...props }) => (
  <div role="listbox" className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md" {...props}>
    {children}
  </div>
)

export const SelectItem: React.FC<SelectItemProps> = ({ children, value, onSelect, ...props }) => (
  <div 
    role="option"
    aria-selected={false}
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
    onClick={() => onSelect?.(value)}
    {...props}
  >
    {children}
  </div>
)

export const SelectTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      aria-haspopup="listbox"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
)
SelectTrigger.displayName = 'SelectTrigger'

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, value, ...props }) => (
  <span className="block truncate" {...props}>
    {value || placeholder}
  </span>
)

// Tab components
export const Tabs: React.FC<TabsProps> = ({ children, defaultValue, value, onValueChange, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || value)
  
  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }
  
  return (
    <div role="tablist" {...props}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab: value || activeTab, onTabChange: handleTabChange } as Record<string, unknown>)
          : child
      )}
    </div>
  )
}

export const TabsList: React.FC<TabsListProps> = ({ children, className, activeTab, onTabChange, ...props }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ''}`} {...props}>
    {React.Children.map(children, child =>
      React.isValidElement(child)
        ? React.cloneElement(child, { activeTab, onTabChange } as Record<string, unknown>)
        : child
    )}
  </div>
)

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, activeTab, onTabChange, className, ...props }) => (
  <button
    role="tab"
    aria-selected={activeTab === value}
    tabIndex={activeTab === value ? 0 : -1}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === value ? 'bg-background text-foreground shadow-sm' : ''} ${className || ''}`}
    onClick={() => onTabChange?.(value)}
    {...props}
  >
    {children}
  </button>
)

export const TabsContent: React.FC<TabsContentProps> = ({ children, value, activeTab, className, ...props }) => 
  activeTab === value ? (
    <div role="tabpanel" tabIndex={0} className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ''}`} {...props}>
      {children}
    </div>
  ) : null

// Simple implementations for missing components
export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
export const TooltipContent: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div role="tooltip" className={`z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md ${className || ''}`} {...props}>
    {children}
  </div>
)
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
export const TooltipTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

export const Modal: React.FC<ModalProps> = ({ children, open, onOpenChange }) => 
  open ? (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => onOpenChange?.(false)}
    >
      <div 
        className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null

export const ModalContent: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div className={`grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg ${className || ''}`} {...props}>
    {children}
  </div>
)

export const ModalHeader: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`} {...props}>
    {children}
  </div>
)

export const ModalFooter: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`} {...props}>
    {children}
  </div>
)

export const Popover: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
export const PopoverContent: React.FC<DivProps> = ({ children, className, ...props }) => (
  <div role="dialog" className={`z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${className || ''}`} {...props}>
    {children}
  </div>
)
export const PopoverTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange, placeholder = "Pick a date range", className, ...props }) => (
  <div className={`grid gap-2 ${className || ''}`}>
    <input
      type="date"
      value={value?.from || ""}
      onChange={(e) => onChange?.({ from: e.target.value, to: value?.to })}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      placeholder={placeholder}
      aria-label="Start date"
      {...props}
    />
    <input
      type="date"
      value={value?.to || ""}
      onChange={(e) => onChange?.({ from: value?.from, to: e.target.value })}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      placeholder="To date"
      aria-label="End date"
    />
  </div>
)
