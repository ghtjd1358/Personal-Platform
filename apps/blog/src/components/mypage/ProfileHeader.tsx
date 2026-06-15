import React from 'react';
import { Button } from '@sonhoseong/mfa-lib';
import { ProfileDetail } from '@/network';

interface ProfileHeaderProps {
  profile: ProfileDetail | null;
  isOwnProfile: boolean;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile,
  onEditClick
}) => {
  return (
    <header className="mypage-header">
      <div className="container">
        <div className="mypage-profile">
          <div className="mypage-avatar">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name || ''} />
            ) : (
              <div className="mypage-avatar-placeholder">
                {profile?.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          <div className="mypage-info">
            <h1 className="mypage-name">{profile?.name || 'Unknown'}</h1>
            <p className="mypage-bio">{profile?.short_bio || ''}</p>
            {isOwnProfile && (
              <Button variant="secondary" className="btn btn-secondary" onClick={onEditClick}>
                프로필 수정
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { ProfileHeader };