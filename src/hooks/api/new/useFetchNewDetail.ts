import { GET_NEW_BY_ID_OR_SLUG } from './../../../constants/api/new';
import useHttpClient from '../useHttpClient';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AddProps {
  title: string;
  slug: string;
  content: string;
  images: string[];
}

const useFetchNewDetail = () => {
  const router = useRouter();
  const [{ data, loading }, _fetch] = useHttpClient(
    {
      ...GET_NEW_BY_ID_OR_SLUG,
    },
    {
      manual: true,
      dataPath: 'data',
    }
  );

  useEffect(() => {
    if (!router.isReady) return;

    const slug = router.query.slug as string;

    if (!slug) return;

    _fetch({
      param: slug,
    });
  }, [router.isReady]);

  return {
    data,
    loading,
  };
};

export default useFetchNewDetail;
