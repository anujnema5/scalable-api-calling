import React, { ReactNode, useEffect, useState } from 'react';
import { useApi } from '@/hooks/use-query-fetch';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiWrapperProps<TData = unknown, TError = Error, TVariables = unknown> = {
    url: string;
    method?: HttpMethod;
    keys?: string[] | string;
    body?: TVariables;
    loader?: ReactNode;
    showLoader?: boolean;
    errorComponent?: ReactNode | ((error: TError) => ReactNode);
    successMessage?: ReactNode;
    children: (props: ApiWrapperChildrenProps<TData, TError, TVariables>) => ReactNode;
};

type QueryChildrenProps<TData, TError> = {
    data: any;
    isLoading: boolean;
    isError: boolean;
    error: TError | null;
    refetch: () => void;
};

type MutationChildrenProps<TData, TError, TVariables> = {
    mutate: (variables: TVariables) => void;
    isLoading: boolean;
    isError: boolean;
    error: TError | null;
    data: TData | undefined;
};

type ApiWrapperChildrenProps<TData, TError, TVariables> =
    | QueryChildrenProps<TData, TError>
    | MutationChildrenProps<TData, TError, TVariables>;

function ApiWrapper<TData = unknown, TError = Error, TVariables = unknown>({
    url,
    method = 'GET',
    keys,
    body,
    loader = 'Loading...',
    errorComponent,
    showLoader = true,
    successMessage,
    children,
}: ApiWrapperProps<TData, TError, TVariables>): React.ReactNode {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const result = useApi({ url, method, keys, body });

    const renderError = (error: TError) => {
        if (errorComponent) {
            return typeof errorComponent === 'function' ? errorComponent(error) : errorComponent;
        }
        return <div>An error occurred: {(error as Error).message}</div>;
    };

    if (!isClient) {
        return null;
    }

    if (method === 'GET') {
        const { data, isLoading, isError, error, refetch } = result as UseQueryResult<TData, TError>;

        return (
            <>
                {isLoading && showLoader ? loader :
                    (isError && error) ? renderError(error) :
                        children({ data, isLoading, isError, error: error || null, refetch })
                }
            </>
        )
    }

    else {
        const { mutate, isPending: isLoading, isError, error, data } = result as UseMutationResult<TData, TError, TVariables>;

        return (
            <>
                {children({ mutate, isLoading, isError, error: error || null, data })}
                {isError && error && renderError(error)}
                {!isLoading && !isError && successMessage}
            </>
        );
    }
}

export default ApiWrapper;