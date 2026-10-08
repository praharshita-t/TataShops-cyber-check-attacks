/**
 * Reusable Button component.
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 */

import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
