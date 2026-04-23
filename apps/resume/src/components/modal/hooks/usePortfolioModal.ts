import { useCallback } from 'react';
import { pushModal } from '../modal-manager';
import { PortfolioModal } from '../PortfolioModal';
import type { PortfolioItem } from '../../../types';

export function usePortfolioModal() {
  const openPortfolioModal = useCallback((portfolio: PortfolioItem) => {
    pushModal({
      component: PortfolioModal,
      props: { portfolio },
    });
  }, []);

  return { openPortfolioModal };
}
