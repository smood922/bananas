import { FC } from 'react';

const handleTopButtonsClick = (evt: React.MouseEvent) => {
  evt.preventDefault();
  const target = evt.target as HTMLButtonElement;
  const root = target.closest('button');
  switch (root.dataset.action) {
    case 'reportABug':
      root.classList.add('is-loading');
      setTimeout(() => {
        root.classList.remove('is-loading');
      }, 3000);
      window.open('https://github.com/mistweaverco/bananas/issues/new');
      break;
    case 'seeTheCode':
      root.classList.add('is-loading');
      setTimeout(() => {
        root.classList.remove('is-loading');
      }, 3000);
      window.open('https://github.com/mistweaverco/bananas');
      break;
    default:
      break;
  }
}

export const Navigation: FC = () => {
  return <>
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-menu p-2">
        <div className="navbar-start">
          <div className="navbar-item">
            <div className="buttons">
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button className="button is-secondary" data-action="reportABug" onClick={handleTopButtonsClick}>
                <span className="icon">
                  <i className="fa-solid fa-bug"></i>
                </span>
                <strong>Report a bug</strong>
              </button>
              <button className="button is-primary" data-action="seeTheCode" onClick={handleTopButtonsClick}>
                <span className="icon">
                  <i className="fa-solid fa-code"></i>
                </span>
                <strong>See the code</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <nav className="panel">
      <p className="panel-heading">Dashboard</p>
      <p className="panel-tabs">
        <a data-action="Overview">
          <span className="icon">
            <i className="fa-solid fa-chart-bar"></i>
          </span>
          Start new session
        </a>
      </p>
    </nav>
  </>;
};
