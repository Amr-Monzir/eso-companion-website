import { type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Beta from '@/pages/beta';
import Contact from '@/pages/contact';
import Support from '@/pages/support';
import { Shell } from '@/components/site';
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

function Router() {
  return (
    <Shell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/beta" component={Beta} />
          <Route path="/installation"><Redirect to="/beta" replace /></Route>
          <Route path="/contact" component={Contact} />
          <Route path="/support" component={Support} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Shell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
  );
}

export default App;
