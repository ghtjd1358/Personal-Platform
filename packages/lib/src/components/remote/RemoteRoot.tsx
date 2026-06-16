import React, { ReactNode } from 'react';
import { ModalContainer } from '../modal';
import { ToastContainer } from '../toast';
import { ErrorBoundary } from '../error';
import { GlobalLoading } from '../loading';
import { ScrollTopButton } from '../button';
import { Container } from '../layout';
import { storage } from '../../utils/storage';
import { useSimpleInitialize } from '../../hooks/use-initialize';

interface RemoteRootProps {
  children: ReactNode;
  hideScrollTop?: boolean;
}

const isHost = storage.isHostApp();

export function RemoteRoot({ children, hideScrollTop }: RemoteRootProps) {
  const { initialized } = useSimpleInitialize();

  if (!initialized) return null;

  const content = (
    <ErrorBoundary>
      <main className="main-content">{children}</main>
      <GlobalLoading />
    </ErrorBoundary>
  );

  return (
    <>
      <ModalContainer />
      <ToastContainer />
      {isHost ? content : <Container>{content}</Container>}
      {!isHost && !hideScrollTop && <ScrollTopButton />}
    </>
  );
}
