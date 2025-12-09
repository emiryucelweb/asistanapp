/* =========================================
   useSmartSuggestions Hook
   AI-powered message suggestions for agents
========================================= */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/shared/utils/logger';
import { useBusiness } from '@/contexts/BusinessContext';
import { 
  smartSuggestionsEngine, 
  SmartSuggestion, 
  SuggestionContext,
  getCurrentTimeOfDay,
  detectSentiment,
  Message as SuggestionMessage
} from '@/services/smart-suggestions';

interface Message {
  content: string;
  isFromCustomer: boolean;
  timestamp: Date;
}

interface UseSmartSuggestionsProps {
  conversationHistory: Message[];
  customerName?: string;
  isVIP?: boolean;
  userInput: string;
}

export const useSmartSuggestions = ({
  conversationHistory,
  customerName,
  isVIP = false,
  userInput
}: UseSmartSuggestionsProps) => {
  const { config } = useBusiness();
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Generate suggestions when input changes
  const generateSuggestions = useCallback(async () => {
    if (!userInput.trim() || userInput.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert message format
      const history: SuggestionMessage[] = conversationHistory.map(msg => ({
        content: msg.content,
        isFromCustomer: msg.isFromCustomer,
        timestamp: msg.timestamp
      }));

      // Detect sentiment from last customer message
      const lastCustomerMessage = history
        .filter(msg => msg.isFromCustomer)
        .pop();
      
      const sentiment = lastCustomerMessage 
        ? detectSentiment(lastCustomerMessage.content)
        : 'neutral';

      // Create suggestion context
      const context: SuggestionContext = {
        userInput,
        conversationHistory: history,
        businessType: config.id,
        customerName,
        isVIP,
        timeOfDay: getCurrentTimeOfDay(),
        sentiment
      };

      // Generate suggestions
      const newSuggestions = smartSuggestionsEngine.generateSuggestions(context);
      setSuggestions(newSuggestions);
      setSelectedIndex(-1);
    } catch (error) {
      logger.error('Error generating suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, conversationHistory, config.id, customerName, isVIP]);

  // Debounced suggestions generation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateSuggestions();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [generateSuggestions]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Escape':
        event.preventDefault();
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  }, [suggestions.length]);

  // Track suggestion usage
  const selectSuggestion = useCallback((suggestion: SmartSuggestion) => {
    smartSuggestionsEngine.trackSuggestionUsage(suggestion.id);
    setSuggestions([]);
    setSelectedIndex(-1);
    return suggestion.text;
  }, []);

  // Select suggestion by index (for keyboard navigation)
  const selectSuggestionByIndex = useCallback((index: number) => {
    const suggestion = suggestions[index];
    if (suggestion) {
      return selectSuggestion(suggestion);
    }
    return null;
  }, [suggestions, selectSuggestion]);

  // Get selected suggestion
  const getSelectedSuggestion = useCallback(() => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      return suggestions[selectedIndex];
    }
    return null;
  }, [suggestions, selectedIndex]);

  return {
    suggestions,
    isLoading,
    selectedIndex,
    selectSuggestion,
    selectSuggestionByIndex,
    getSelectedSuggestion,
    handleKeyDown,
    clearSuggestions: () => {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };
};
