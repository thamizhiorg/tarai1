import React, { createContext, useContext, ReactNode, useState } from 'react';

type AgentContextType = {
  currentAgentId: string;
  setCurrentAgentId: (id: string) => void;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [currentAgentId, setCurrentAgentId] = useState('1'); // Default to Products agent

  return (
    <AgentContext.Provider
      value={{
        currentAgentId,
        setCurrentAgentId,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
