import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiSwitch from '@material-ui/core/Switch';

export default function Switch({ label, value, ...rest }) {
  return (
    <FormControlLabel
      control={<MuiSwitch checked={value} {...rest} />}
      label={label}
    />
  );
}
