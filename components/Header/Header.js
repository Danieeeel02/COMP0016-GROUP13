import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Nav } from 'rsuite';
import Link from 'next/link';

import styles from './Header.module.css';

import { ProfileButton } from '..';
import roles from '../../lib/roles';

const paths = {
  [roles.USER_TYPE_ADMIN]: ['manage'],
  [roles.USER_TYPE_HEALTH_BOARD]: ['statistics'],
  [roles.USER_TYPE_HOSPITAL]: ['statistics', 'manage'],
  [roles.USER_TYPE_DEPARTMENT]: ['statistics', 'self-assessment', 'manage'],
  [roles.USER_TYPE_CLINICIAN]: ['statistics', 'self-assessment'],
};

function Header() {
  const router = useRouter();
  const [session, loading] = useSession(); // TODO use loading state better?

  const renderLinks = () => {
    const role = session.roles[0]; // TODO do we want to support multiple roles?
    const pathsForRole = paths[role];
    if (!pathsForRole) return <div />;

    return pathsForRole.map((path, i) => (
      <Link key={i} href={'/'.concat(path)}>
        <Nav.Item active={router.pathname === `/${path}`}>{path}</Nav.Item>
      </Link>
    ));
  };

  return (
    <Nav className={styles.header}>
      <Link href="/">
        <Nav.Item className={styles.logoWrapper}>
          <span className={styles.logo}>CQ Dashboard</span>
        </Nav.Item>
      </Link>
      {session && renderLinks()}
      <div className={styles.profile}>
        {session ? (
          <ProfileButton />
        ) : (
          <Nav.Item onClick={() => signIn('keycloak')}>Log in</Nav.Item>
        )}
      </div>
    </Nav>
  );
}

export default Header;
