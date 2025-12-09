/**
 * Empty State Component
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Inbox, 
  Search, 
  FileX, 
  Users, 
  MessageSquare, 
  AlertCircle,
  FolderOpen,
  Database,
  ShoppingCart,
  Calendar,
  LucideIcon
} from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  size = 'md',
}) => {
  const { t } = useTranslation('common');
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-xl',
      description: 'text-base',
    },
  };

  const variantClasses = {
    default: {
      iconBg: 'bg-gray-100 dark:bg-slate-800',
      iconColor: 'text-gray-400 dark:text-gray-500',
    },
    search: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    error: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size].container}`}>
      <div className={`p-4 rounded-full ${variantClasses[variant].iconBg} mb-4`}>
        <Icon className={`${sizeClasses[size].icon} ${variantClasses[variant].iconColor}`} />
      </div>
      
      <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 ${sizeClasses[size].title}`}>
        {title}
      </h3>
      
      {description && (
        <p className={`text-gray-600 dark:text-gray-400 max-w-md mb-6 ${sizeClasses[size].description}`}>
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center">
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Predefined Empty States
export const NoSearchResults: React.FC<{ query?: string; onClear?: () => void }> = ({ 
  query, 
  onClear 
}) => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={Search}
      variant="search"
      title={t('emptyStates.noResults')}
      description={query ? t('emptyStates.searchNoResultsForQuery', { query }) : t('emptyStates.searchNoResults')}
      action={onClear ? { label: t('emptyStates.clearSearch'), onClick: onClear } : undefined}
    />
  );
};

export const NoData: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={Database}
      title={t('emptyStates.noData')}
      description={message || t('emptyStates.noDataDescription')}
    />
  );
};

export const NoMessages: React.FC<{ onStartChat?: () => void }> = ({ onStartChat }) => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={MessageSquare}
      title={t('emptyStates.noMessages')}
      description={t('emptyStates.noMessagesDescription')}
      action={onStartChat ? { label: t('emptyStates.sendMessage'), onClick: onStartChat } : undefined}
    />
  );
};

export const NoUsers: React.FC<{ onAddUser?: () => void }> = ({ onAddUser }) => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={Users}
      title={t('emptyStates.noUsers')}
      description={t('emptyStates.noUsersDescription')}
      action={onAddUser ? { label: t('emptyStates.addUser'), onClick: onAddUser } : undefined}
    />
  );
};

export const NoFiles: React.FC<{ onUpload?: () => void }> = ({ onUpload }) => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={FileX}
      title={t('emptyStates.noFiles')}
      description={t('emptyStates.noFilesDescription')}
      action={onUpload ? { label: t('emptyStates.uploadFile'), onClick: onUpload } : undefined}
    />
  );
};

export const EmptyFolder: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={FolderOpen}
      title={t('emptyStates.emptyFolder')}
      description={t('emptyStates.emptyFolderDescription')}
      size="sm"
    />
  );
};

export const NoOrders: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={ShoppingCart}
      title={t('emptyStates.noOrders')}
      description={t('emptyStates.noOrdersDescription')}
    />
  );
};

export const NoEvents: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={Calendar}
      title={t('emptyStates.noEvents')}
      description={t('emptyStates.noEventsDescription')}
      action={onCreate ? { label: t('emptyStates.createEvent'), onClick: onCreate } : undefined}
    />
  );
};

export const ErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const { t } = useTranslation('common');
  return (
    <EmptyState
      icon={AlertCircle}
      variant="error"
      title={t('emptyStates.error')}
      description={t('emptyStates.errorDescription')}
      action={onRetry ? { label: t('retry'), onClick: onRetry } : undefined}
    />
  );
};

