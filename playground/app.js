import React, { Component } from "react";
import { render } from "react-dom";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";

import { shouldRender } from "../src/utils";
import { samples } from "./samples";
import Form from "../src";

// Import a few CodeMirror themes; these are used to match alternative
// bootstrap ones.
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/eclipse.css";

const log = type => console.log.bind(console, type);
const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
const liveSettingsSchema = {
  type: "object",
  properties: {
    validate: { type: "boolean", title: "Live validation" },
    disable: { type: "boolean", title: "Disable whole form" },
  },
};
const cmOptions = {
  theme: "default",
  height: "auto",
  viewportMargin: Infinity,
  mode: {
    name: "javascript",
    json: true,
    statementIndent: 2,
  },
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: false,
  tabSize: 2,
};
const themes = {
  default: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css",
  },
  cerulean: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/cerulean/bootstrap.min.css",
  },
  cosmo: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/cosmo/bootstrap.min.css",
  },
  cyborg: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/cyborg/bootstrap.min.css",
    editor: "blackboard",
  },
  darkly: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/darkly/bootstrap.min.css",
    editor: "mbo",
  },
  flatly: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/flatly/bootstrap.min.css",
    editor: "ttcn",
  },
  journal: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/journal/bootstrap.min.css",
  },
  lumen: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/lumen/bootstrap.min.css",
  },
  paper: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/paper/bootstrap.min.css",
  },
  readable: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/readable/bootstrap.min.css",
  },
  sandstone: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/sandstone/bootstrap.min.css",
    editor: "solarized",
  },
  simplex: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/simplex/bootstrap.min.css",
    editor: "ttcn",
  },
  slate: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/slate/bootstrap.min.css",
    editor: "monokai",
  },
  spacelab: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/spacelab/bootstrap.min.css",
  },
  "solarized-dark": {
    stylesheet:
      "//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-dark.css",
    editor: "dracula",
  },
  "solarized-light": {
    stylesheet:
      "//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-light.css",
    editor: "solarized",
  },
  superhero: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/superhero/bootstrap.min.css",
    editor: "dracula",
  },
  united: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/united/bootstrap.min.css",
  },
  yeti: {
    stylesheet:
      "//stackpath.bootstrapcdn.com/bootswatch/4.2.1/yeti/bootstrap.min.css",
    editor: "eclipse",
  },
};

class GeoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <div className="geo">
        <h3>Hey, I'm a custom component</h3>
        <p>
          I'm registered as <code>geo</code> and referenced in
          <code>uiSchema</code> as the <code>ui:field</code> to use for this
          schema.
        </p>
        <div className="row">
          <div className="col-6">
            <label>Latitude</label>
            <input
              className="form-control"
              type="number"
              value={lat}
              step="0.00001"
              onChange={this.onChange("lat")}
            />
          </div>
          <div className="col-6">
            <label>Longitude</label>
            <input
              className="form-control"
              type="number"
              value={lon}
              step="0.00001"
              onChange={this.onChange("lon")}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onCodeChange = (editor, metadata, code) => {
    this.setState({ valid: true, code });
    setImmediate(() => {
      try {
        this.props.onChange(fromJson(this.state.code));
      } catch (err) {
        this.setState({ valid: false, code });
      }
    });
  };

  render() {
    const { title, theme } = this.props;
    const icon = this.state.valid ? "check" : "times";
    const cls = this.state.valid ? "valid" : "invalid";
    return (
      <div className="card mb-3">
        <div className="card-header">
          <span className={`${cls} fas fa-fw fa-${icon}`} />
          {" " + title}
        </div>
        <CodeMirror
          value={this.state.code}
          onChange={this.onCodeChange}
          autoCursor={false}
          options={Object.assign({}, cmOptions, { theme })}
        />
      </div>
    );
  }
}

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Simple" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <ul className="nav nav-pills">
        {Object.keys(samples).map((label, i) => {
          return (
            <li key={i} role="presentation" className="nav-item">
              <a
                href="#"
                onClick={this.onLabelClick(label)}
                className={
                  this.state.current === label ? "nav-link active" : "nav-link"
                }>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

function ThemeSelector({ theme, select }) {
  const themeSchema = {
    type: "string",
    enum: Object.keys(themes),
  };
  return (
    <Form
      schema={themeSchema}
      formData={theme}
      onChange={({ formData }) => select(formData, themes[formData])}>
      <div />
    </Form>
  );
}

class CopyLink extends Component {
  onCopyClick = event => {
    this.input.select();
    document.execCommand("copy");
  };

  render() {
    const { shareURL, onShare } = this.props;
    if (!shareURL) {
      return (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={onShare}>
          Share
        </button>
      );
    }
    return (
      <div className="input-group">
        <input
          type="text"
          ref={input => (this.input = input)}
          className="form-control"
          defaultValue={shareURL}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-default"
            type="button"
            onClick={this.onCopyClick}>
            <i className="glyphicon glyphicon-copy" />
          </button>
        </span>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    // initialize state with Simple data sample
    const { schema, uiSchema, formData, validate } = samples.Simple;
    this.state = {
      form: false,
      schema,
      uiSchema,
      formData,
      validate,
      editor: "default",
      theme: "default",
      liveSettings: {
        validate: true,
        disable: false,
      },
      shareURL: null,
    };
  }

  componentDidMount() {
    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === "string" && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert("Unable to load form setup data.");
      }
    } else {
      this.load(samples.Simple);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = data => {
    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate, ObjectFieldTemplate } = data;
    // uiSchema is missing on some examples. Provide a default to
    // clear the field in all cases.
    const { uiSchema = {} } = data;
    // force resetting form component instance
    this.setState({ form: false }, _ =>
      this.setState({
        ...data,
        form: true,
        ArrayFieldTemplate,
        ObjectFieldTemplate,
        uiSchema,
      })
    );
  };

  onSchemaEdited = schema => this.setState({ schema, shareURL: null });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema, shareURL: null });

  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  onThemeSelected = (theme, { stylesheet, editor }) => {
    this.setState({ theme, editor: editor ? editor : "default" });
    setImmediate(() => {
      // Side effect!
      document.getElementById("theme").setAttribute("href", stylesheet);
    });
  };

  setLiveSettings = ({ formData }) => this.setState({ liveSettings: formData });

  onFormDataChange = ({ formData }) =>
    this.setState({ formData, shareURL: null });

  onShare = () => {
    const { formData, schema, uiSchema } = this.state;
    const {
      location: { origin, pathname },
    } = document;
    try {
      const hash = btoa(JSON.stringify({ formData, schema, uiSchema }));
      this.setState({ shareURL: `${origin}${pathname}#${hash}` });
    } catch (err) {
      this.setState({ shareURL: null });
    }
  };

  render() {
    const {
      schema,
      uiSchema,
      formData,
      liveSettings,
      validate,
      theme,
      editor,
      ArrayFieldTemplate,
      ObjectFieldTemplate,
      transformErrors,
    } = this.state;

    return (
      <div className="container-fluid my-5">
        <div className="page-header">
          <h1>react-jsonschema-form</h1>
          <div className="row">
            <div className="col-8">
              <Selector onSelected={this.load} />
            </div>
            <div className="col-2">
              <Form
                schema={liveSettingsSchema}
                formData={liveSettings}
                onChange={this.setLiveSettings}
                IconButtonComponent={({ type, className, icon, ...otherProps }) => <button
                  type="button"
                  className={`btn btn-${type} ${className}`}
                  {...otherProps}>
                  New
            {/* <i className={`fas fa-${icon}`} /> */}
                </button>}
              >
                <div />
              </Form>
            </div>
            <div className="col-2">
              <ThemeSelector theme={theme} select={this.onThemeSelected} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-7">
            <Editor
              title="JSONSchema"
              theme={editor}
              code={toJson(schema)}
              onChange={this.onSchemaEdited}
            />
            <div className="row">
              <div className="col-6">
                <Editor
                  title="UISchema"
                  theme={editor}
                  code={toJson(uiSchema)}
                  onChange={this.onUISchemaEdited}
                />
              </div>
              <div className="col-6">
                <Editor
                  title="formData"
                  theme={editor}
                  code={toJson(formData)}
                  onChange={this.onFormDataEdited}
                />
              </div>
            </div>
          </div>
          <div className="col-5">
            {this.state.form && (
              <Form
                ArrayFieldTemplate={ArrayFieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                liveValidate={liveSettings.validate}
                disabled={liveSettings.disable}
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={this.onFormDataChange}
                onSubmit={({ formData }, e) => {
                  console.log("submitted formData", formData);
                  console.log("submit event", e);
                }}
                fields={{ geo: GeoPosition }}
                validate={validate}
                onBlur={(id, value) =>
                  console.log(`Touched ${id} with value ${value}`)
                }
                onFocus={(id, value) =>
                  console.log(`Focused ${id} with value ${value}`)
                }
                transformErrors={transformErrors}
                onError={log("errors")}
                IconButtonComponent={({ type, className, icon, ...otherProps }) => <button
                  type="button"
                  className={`btn btn-${type} ${className}`}
                  {...otherProps}>
                  {icon}
            <i className={`fas fa-${icon}`} />
                </button>}
              >
                <div className="row">
                  <div className="col-3">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                  <div className="col-9 text-right">
                    <CopyLink
                      shareURL={this.state.shareURL}
                      onShare={this.onShare}
                    />
                  </div>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
