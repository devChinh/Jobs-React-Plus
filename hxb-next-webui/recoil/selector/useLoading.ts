import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../atom/loadingState";

export default function useLoading({
  id,
  shouldShowLoading,
}: {
  id: string;
  shouldShowLoading: boolean;
}) {
  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    const removeLoadingState = () => {
      setLoading((oldLoading: any) => {
        const { [id]: _removed, ...updatedLoading } = oldLoading;
        return updatedLoading;
      });
    };

    if (shouldShowLoading) {
      setLoading((oldLoading) => ({
        ...oldLoading,
        [id]: id,
      }));
    } else {
      removeLoadingState();
    }

    // if component unmounts while in loading state,we need to make
    // sure we cleanup with `useEffect` unsubscribe (end loading state)
    return () => {
      removeLoadingState();
    };
  }, [shouldShowLoading]);
}
