import React, { useCallback, useState, useEffect } from 'react';
import { useAsyncState } from '@sonhoseong/mfa-lib';
import { LoadingSpinner } from '@/components/loading';
import { getTags, TagDetail } from '@/network';
import { ManageHeader, TagForm, TagList } from './components';

const ManagePage: React.FC = () => {
  // useAsyncState 는 read-only 한 fetch 결과를 관리 — TagForm 생성 후 append 가 필요하므로
  // hook 의 data 를 seed 로 받아 local list 에 mirror 한다 (CRUD 결과를 refetch 없이 누적).
  const fetchTags = useCallback(async (): Promise<TagDetail[]> => {
    const res = await getTags();
    return res.success && res.data ? res.data : [];
  }, []);
  const { data, isLoading } = useAsyncState<TagDetail[]>(fetchTags, {
    initialData: [],
    autoExecute: true,
  });
  const [tags, setTags] = useState<TagDetail[]>([]);
  useEffect(() => {
    if (data) setTags(data);
  }, [data]);

  const handleTagCreated = (newTag: TagDetail) => {
    setTags((prev) => [...prev, newTag]);
  };

  if (isLoading) {
    return <LoadingSpinner className="manage-page-loading" />;
  }

  return (
    <div className="manage-page">
      <ManageHeader />
      <div className="manage-content">
        <div className="container">
          <div className="manage-section">
            <TagForm onTagCreated={handleTagCreated} />
            <TagList tags={tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
