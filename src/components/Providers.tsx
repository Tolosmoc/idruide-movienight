'use client';

import { useState, useEffect } from 'react';
import { BaseProvider, LightTheme } from 'baseui';
import { Provider as StyletronProvider } from 'styletron-react';

import type { Client } from 'styletron-engine-atomic';

export function Providers({ children }: { children: React.ReactNode }) {
    const [engine, setEngine] = useState<Client | null>(null);

    useEffect(() => {
        // dynamically import Styletron only on the client
        import('styletron-engine-atomic').then(({ Client }) => {
            setEngine(new Client());
        });
    }, []);

    if (!engine) return null; // or a loader

    return (
        <StyletronProvider value={engine}>
            <BaseProvider theme={LightTheme}>
                {children}
            </BaseProvider>
        </StyletronProvider>
    );
}