'use client';

import { UserProfile } from '@/lib/types/profile';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth-store';

interface UserInformationProps {
  userProfile: UserProfile;
}

function UserInformation({ userProfile }: UserInformationProps) {
  const { isLoggedIn, role } = useAuthStore();
  const isAdmin = isLoggedIn && role === 'admin';

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-start mb-8 my-4">
      <div className="mr-7 mt-2">
        <Image
          src="/profile-placeholder.svg"
          height={80}
          width={80}
          alt="profile"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mr-4 my-2">
                {userProfile.username}
              </h1>
              {/* Show admin controls only if the current user is an admin */}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  style={{ cursor: 'pointer' }}
                  title="Hide user"
                >
                  <Image
                    src="/hide-user.svg"
                    height={30}
                    width={30}
                    alt="hide user"
                  />
                </Button>
              )}
            </div>
            <p className="text-xl font-semibold text-foreground my-3">
              {userProfile.name}
            </p>
            <div className="text-base font-semibold text-secondary-foreground">
              <p className="my-2">
                Date joined - {formatDate(userProfile.createdAt)}
              </p>
              <p className="my-2">
                Last Active - {formatDate(userProfile.lastActive)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-highlight my-2">
                {userProfile.stats.rank}
              </div>
              <div className="text-xl text-secondary-foreground font-semibold my-2">
                Rank
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold my-2">
                {userProfile.stats.totalPoints}
              </div>
              <div className="text-xl text-secondary-foreground font-semibold my-2">
                Points
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInformation;
