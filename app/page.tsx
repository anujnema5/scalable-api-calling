'use client';
import ApiWrapper from "@/providers/api-wrapper";

export default function Home() {
  return (
    <ApiWrapper
      url="/TanStack/query"
    // loader={<CustomLoader />}
    // errorComponent={(error) => <CustomError error={error} />}
    // successMessage={<SuccessAlert />}
    >
      {({ data, isLoading, isError, error }) => (
        <div>
          <h1>{data.name}</h1>
          <p>{data.description}</p>
          <strong>👀 {data.subscribers_count}</strong>
          <strong>✨ {data.stargazers_count}</strong>
          <strong>🍴 {data.forks_count}</strong>
        </div>
      )}
    </ApiWrapper>
  );
}


