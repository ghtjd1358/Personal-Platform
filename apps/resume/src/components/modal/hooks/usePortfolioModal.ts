import { useCallback } from 'react';
import { pushModal } from '../modal-manager';
import { PortfolioModal } from '../PortfolioModal';
import { PortfolioItem } from '../../../data';

export function usePortfolioModal() {
  const openPortfolioModal = useCallback((portfolio: PortfolioItem) => {
    pushModal({
      component: PortfolioModal,
      props: { portfolio },
    });
  }, []);

  return { openPortfolioModal };
}
