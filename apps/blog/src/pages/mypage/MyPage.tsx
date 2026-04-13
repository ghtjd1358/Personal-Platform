import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@sonhoseong/mfa-lib';
import { LoadingSpinner } from '@/components/loading';
import { useMyPageData, useScrollAnimation } from '@/hooks';
import { LINK_PREFIX } from '@/config/constants';
import {
  ProfileHeader,
  UserStats,
  TabNavigation,
  PostsTab,
  SeriesTab,
  IntroTab,
  ProfileEditModal,
  TabType
} from '@/components';

const MyPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  // /my 접근 시 /container/user/:userId로 리다이렉트
  useEffect(() => {
    if (!userId) {
      const currentUser = getCurrentUser();
      if (currentUser?.id) {
        navigate(`/container/user/${currentUser.id}`, { replace: true });
      }
    }
  }, [userId, navigate]);

  // targetUserId - URL에서 직접 가져옴
  const targetUserId = userId;

  const isOwnProfile = useMemo(() => {
    if (!targetUserId) return false;
    const currentUser = getCurrentUser();
    return currentUser?.id === targetUserId;
  }, [targetUserId]);

  const { profile, posts, series, stats, isLoading, refetch } = useMyPageData(targetUserId);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [editModalOpen, setEditModalOpen] = useState(false);

  // 스크롤 애니메이션 - activeTab 변경 시에도 재설정
  useScrollAnimation([posts.length, activeTab]);

  const handleProfileSave = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner className="mypage-loading-full" />;
  }

  if (!targetUserId) {
    return (
      <div className="mypage">
        <div className="container">
          <div className="mypage-empty">
            <p>사용자 정보를 불러올 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEditClick={() => setEditModalOpen(true)}
      />

      <UserStats stats={stats} />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          posts: posts.length,
          series: series.length
        }}
      />

      {activeTab === 'posts' && <PostsTab posts={posts} />}
      {activeTab === 'series' && (
        <SeriesTab
          series={series}
          userId={targetUserId}
          isOwnProfile={isOwnProfile}
          onRefresh={refetch}
        />
      )}
      {activeTab === 'intro' && <IntroTab profile={profile} />}

      {isOwnProfile && (
        <ProfileEditModal
          isOpen={editModalOpen}
          profile={profile}
          onClose={() => setEditModalOpen(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
};

export default MyPage;