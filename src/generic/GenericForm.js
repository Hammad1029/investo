import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { camelToNormal } from "../utils";

const GenericForm = ({
  formFields,
  fieldXs = 6,
  fieldMd,
  fieldLg,
  gridSpacing = 2,
  formik,
  submitText = "Submit",
  buttons = [],
  disabled = false,
  submitDisabled = false,
  formSx = {},
  debug = false,
}) => {
  const getProps = (field) => {
    const fieldObj = typeof field === "object";
    const fieldName = fieldObj ? field.name : field;
    const fD = disabled || (fieldObj && field?.disabled) || false;
    return {
      id: fieldName,
      name: fieldName,
      onBlur: formik.handleBlur,
      onChange: (event) => {
        fieldObj &&
          field?.onChange &&
          typeof field?.onChange === "function" &&
          field.onChange(event.target.value, event.target.name);
        formik.handleChange(event);
      },
      error: formik.touched[fieldName] && formik.errors[fieldName],
      value: formik.values[fieldName],
      disabled: fD,
      fullWidth: true,
    };
  };

  const getField = (field) => {
    if (typeof field === "string")
      return (
        <TextField
          {...getProps(field)}
          type="text"
          disabled={disabled}
          {...field.props}
        />
      );
    switch (field?.type) {
      case "number":
        return (
          <TextField {...getProps(field)} type="number" {...field.props} />
        );
      case "select":
        return (
          <Select {...getProps(field)} {...field.props}>
            {field.options?.map((o) => (
              <MenuItem key={o?.value || o} value={o?.value || o}>
                {o?.label || camelToNormal(o?.value || o)}
              </MenuItem>
            ))}
          </Select>
        );
      case "multiline":
        return (
          <TextField
            multiline
            rows={4}
            {...getProps(field)}
            type="text"
            {...field.props}
          />
        );
      case "password":
        return (
          <TextField
            {...getProps(field)}
            type={field.show ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={field.toggle} edge="end">
                    {field.show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...field.props}
          />
        );

      case "switch":
        return (
          <Switch
            {...getProps(field)}
            checked={formik.values[field.name]}
            {...field.props}
          />
        );
      case "text":
      default:
        return <TextField {...getProps(field)} type="text" {...field.props} />;
    }
  };

  const renderFields = () =>
    formFields.map((f) => {
      if (f.display === false) return;
      const label =
        f.type === "custom" ? "" : f?.label || camelToNormal(f?.name || f);
      const fieldDisabled = disabled || f?.disabled || false;
      const error = formik.touched[f.name || f] && formik.errors[f.name || f];
      return (
        <Grid
          key={f.name || f}
          item
          xs={f?.xs || fieldXs}
          md={f?.md || fieldMd || f?.xs || fieldXs}
          lg={f?.lg || fieldLg || f?.md || fieldMd || f?.xs || fieldXs}
        >
          {f.type === "custom" ? (
            f.component({ ...getProps(f.name, label, fieldDisabled) })
          ) : (
            <>
              <InputLabel error={error} sx={{ pl: 0.5, pb: 0.2 }}>
                {label}
              </InputLabel>
              <FormControl fullWidth error={error} disabled={fieldDisabled}>
                {getField(f, label)}
                {error && <FormHelperText>{error}</FormHelperText>}
              </FormControl>
            </>
          )}
        </Grid>
      );
    });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={formSx}>
      <Grid container spacing={gridSpacing}>
        {debug && (
          <Grid item xs={12}>
            <ButtonGroup variant="contained">
              <Button onClick={() => console.log(formik.values)}>Values</Button>
              <Button onClick={() => console.log(formik.errors)}>Errors</Button>
              <Button onClick={() => console.log(formik.touched)}>
                Touched
              </Button>
              <Button onClick={() => console.log(formik)}>Formik</Button>
            </ButtonGroup>
          </Grid>
        )}
        {renderFields()}
        <Grid item xs={12}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            <ButtonGroup size="small" variant="contained" disabled={disabled}>
              {buttons.map((but, i) => (
                <Button
                  key={`generic-form-button-${i}`}
                  type={but.type || "button"}
                  onClick={but.callback || console.log}
                  disabled={but.disabled}
                >
                  {but.label || ""}
                </Button>
              ))}
              {submitText && (
                <Button
                  disabled={submitDisabled}
                  variant="contained"
                  type="submit"
                >
                  {submitText}
                </Button>
              )}
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenericForm;
