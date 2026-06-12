import { getSettingsModel } from "../domain/settingsModel.js";
import { escapeHtml } from "../../../shared/html.js";
import { icon, pageHeading } from "../../../shared/ui.js";

function sectionCard({ iconName, title, body = "", content, className = "" }) {
  return `
    <article class="card settings-card ${escapeHtml(className)}">
      <div class="card-header">
        <div>
          <h3 class="card-title">${escapeHtml(title)}</h3>
        </div>
        ${icon(iconName)}
      </div>
      ${body ? `<p class="card-body">${escapeHtml(body)}</p>` : ""}
      <div class="settings-list">
        ${content}
      </div>
    </article>
  `;
}

function row({ label, description = "", control }) {
  return `
    <div class="setting-row">
      <div class="setting-copy">
        <span class="setting-label">${escapeHtml(label)}</span>
        ${description ? `<span class="meta-line">${escapeHtml(description)}</span>` : ""}
      </div>
      <div class="setting-control">
        ${control}
      </div>
    </div>
  `;
}

function action(label, actionName, iconName = "chevron_right") {
  return `
    <button class="text-button settings-action" type="button" data-settings-action="${escapeHtml(actionName)}">
      ${icon(iconName)}
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}

function segmented({ name, value, options }) {
  return `
    <div class="segmented-control" role="group" aria-label="${escapeHtml(name)}">
      ${options.map((option) => `
        <button
          class="segment-button"
          type="button"
          data-preference-option="${escapeHtml(name)}"
          data-value="${escapeHtml(option.value)}"
          aria-pressed="${option.value === value ? "true" : "false"}"
        >
          ${escapeHtml(option.label)}
        </button>
      `).join("")}
    </div>
  `;
}

function selectControl({ name, label, value, options }) {
  return `
    <label class="sr-only" for="${escapeHtml(name)}">${escapeHtml(label)}</label>
    <select class="setting-select" id="${escapeHtml(name)}" data-setting-select="${escapeHtml(name)}">
      ${options.map((option) => `
        <option value="${escapeHtml(option.value)}" ${option.value === value ? "selected" : ""}>
          ${escapeHtml(option.label)}
        </option>
      `).join("")}
    </select>
  `;
}

function textInput({ name, label, value, placeholder = "" }) {
  return `
    <label class="sr-only" for="${escapeHtml(name)}">${escapeHtml(label)}</label>
    <input
      class="setting-input"
      id="${escapeHtml(name)}"
      data-setting-input="${escapeHtml(name)}"
      value="${escapeHtml(value)}"
      placeholder="${escapeHtml(placeholder)}"
    >
  `;
}

function toggle({ name, label, checked }) {
  return `
    <label class="toggle-control">
      <span class="sr-only">${escapeHtml(label)}</span>
      <input type="checkbox" data-setting-checkbox="${escapeHtml(name)}" ${checked ? "checked" : ""}>
      <span class="toggle-track" aria-hidden="true">
        <span class="toggle-thumb"></span>
      </span>
    </label>
  `;
}

function timeInput({ name, label, value }) {
  return `
    <label class="sr-only" for="${escapeHtml(name)}">${escapeHtml(label)}</label>
    <input class="setting-time" id="${escapeHtml(name)}" data-setting-time="${escapeHtml(name)}" type="time" value="${escapeHtml(value)}">
  `;
}

function notificationRows(items, model) {
  const labels = model.labels;
  const preferences = model.preferences;

  return items.map((item) => {
    const enabled = preferences.notifications[item.name];
    return `
      <div class="settings-stack">
        ${row({
          label: labels[item.label],
          description: enabled ? labels.enabled : labels.disabled,
          control: toggle({
            name: `notifications.${item.name}`,
            label: labels[item.label],
            checked: enabled
          })
        })}
        ${row({
          label: labels.reminderTime,
          control: timeInput({
            name: `notificationTimes.${item.name}`,
            label: `${labels[item.label]} ${labels.reminderTime}`,
            value: preferences.notificationTimes[item.name]
          })
        })}
      </div>
    `;
  }).join("");
}

function prayerPreferenceRows(items, model) {
  const labels = model.labels;
  const preferences = model.preferences;

  return items.map((item) => {
    const enabled = preferences.prayerPreferences[item.name];
    return `
      <div class="settings-stack">
        ${row({
          label: labels[item.label],
          description: enabled ? labels.enabled : labels.disabled,
          control: toggle({
            name: `prayerPreferences.${item.name}`,
            label: labels[item.label],
            checked: enabled
          })
        })}
        ${row({
          label: labels.reminderTime,
          control: timeInput({
            name: `prayerTimes.${item.name}`,
            label: `${labels[item.label]} ${labels.reminderTime}`,
            value: preferences.prayerTimes[item.name]
          })
        })}
      </div>
    `;
  }).join("");
}

export function renderSettings(state) {
  const model = getSettingsModel(state.preferences, state.settingsMessage, state.settingsSection);

  if (model.selectedSection) {
    return renderSettingsSubpage(model);
  }

  return renderSettingsIndex(model);
}

function renderSettingsIndex(model) {
  return `
    <section class="page settings-page">
      ${pageHeading(model.title, model.body)}
      ${model.statusMessage ? `<p class="status-note" role="status">${escapeHtml(model.statusMessage)}</p>` : ""}
      <div class="settings-section-grid">
        ${model.sections.map((section) => `
          <button class="card settings-section-card" type="button" data-settings-section="${escapeHtml(section.id)}">
            <div class="card-header">
              <div>
                <h3 class="card-title">${escapeHtml(section.title)}</h3>
              </div>
              ${icon(section.iconName)}
            </div>
            <p class="card-body">${escapeHtml(section.body)}</p>
            <span class="settings-section-action">
              <span>${escapeHtml(model.labels.openSection)}</span>
              ${icon("chevron_right")}
            </span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSettingsSubpage(model) {
  const section = model.selectedSection;

  return `
    <section class="page settings-page settings-subpage">
      <div class="page-heading">
        <button class="text-button back-button" type="button" data-settings-back>
          ${icon("arrow_back")}
          <span>${escapeHtml(model.labels.backToSettings)}</span>
        </button>
        <h2>${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.body)}</p>
      </div>
      ${model.statusMessage ? `<p class="status-note" role="status">${escapeHtml(model.statusMessage)}</p>` : ""}
      <div class="settings-subpage-content">
        ${renderSettingsSection(model)}
      </div>
    </section>
  `;
}

function renderSettingsSection(model) {
  const section = model.selectedSection;

  if (section.id === "account") {
    return renderAccountSection(model);
  }

  if (section.id === "appearance") {
    return renderAppearanceSection(model);
  }

  if (section.id === "language") {
    return renderLanguageSection(model);
  }

  if (section.id === "notifications") {
    return renderNotificationsSection(model);
  }

  if (section.id === "prayer-preferences") {
    return renderPrayerPreferencesSection(model);
  }

  if (section.id === "app-settings") {
    return renderAppSettingsSection(model);
  }

  if (section.id === "about") {
    return renderAboutSection(model);
  }

  return renderSupportSection(model);
}

function renderAccountSection(model) {
  const labels = model.labels;
  const preferences = model.preferences;
  const avatar = preferences.profilePicture
    ? `<img src="${escapeHtml(preferences.profilePicture)}" alt="${escapeHtml(labels.profilePicture)}">`
    : icon("account_circle");

  return sectionCard({
    iconName: "account_circle",
    title: labels.account,
    content: `
      <div class="settings-action-row">
        ${action(labels.signIn, "sign-in", "login")}
        ${action(labels.createAccount, "create-account", "person_add")}
        ${action(labels.continueOffline, "continue-offline", "cloud_off")}
      </div>
      ${row({
        label: labels.profilePicture,
        control: `
          <div class="profile-control">
            <div class="profile-avatar">${avatar}</div>
            <label class="text-button settings-action file-button">
              ${icon("photo_camera")}
              <span>${escapeHtml(labels.choose)}</span>
              <input class="sr-only" type="file" accept="image/*" data-profile-picture>
            </label>
          </div>
        `
      })}
      ${row({
        label: labels.displayName,
        control: textInput({
          name: "displayName",
          label: labels.displayName,
          value: preferences.displayName,
          placeholder: "Orthodoxia"
        })
      })}
      ${row({
        label: labels.email,
        control: textInput({
          name: "email",
          label: labels.email,
          value: preferences.email,
          placeholder: "name@example.com"
        })
      })}
      ${row({
        label: labels.bibleTranslation,
        control: selectControl({
          name: "preferredBibleTranslation",
          label: labels.bibleTranslation,
          value: preferences.preferredBibleTranslation,
          options: model.bibleTranslations.map((translation) => ({ value: translation, label: translation }))
        })
      })}
      ${row({
        label: labels.prayerLanguage,
        control: selectControl({
          name: "preferredPrayerLanguage",
          label: labels.prayerLanguage,
          value: preferences.preferredPrayerLanguage,
          options: model.prayerLanguages.map((language) => ({ value: language, label: language }))
        })
      })}
      <div class="segmented-row">
        ${model.account.futureAuth.map((provider) => `<span class="small-pill">${escapeHtml(labels.future)}: ${escapeHtml(provider)}</span>`).join("")}
      </div>
    `
  });
}

function renderAppearanceSection(model) {
  const labels = model.labels;
  const preferences = model.preferences;

  return sectionCard({
    iconName: "contrast",
    title: labels.appearance,
    content: `
      ${row({
        label: labels.appearance,
        control: segmented({
          name: "appearance",
          value: preferences.appearance,
          options: [
            { value: "light", label: labels.light },
            { value: "dark", label: labels.dark },
            { value: "system", label: labels.system }
          ]
        })
      })}
      ${row({
        label: labels.textSize,
        control: segmented({
          name: "textSize",
          value: preferences.textSize,
          options: [
            { value: "small", label: labels.small },
            { value: "medium", label: labels.medium },
            { value: "large", label: labels.large }
          ]
        })
      })}
    `
  });
}

function renderLanguageSection(model) {
  const labels = model.labels;
  const preferences = model.preferences;

  return sectionCard({
    iconName: "language",
    title: labels.language,
    content: `
      ${row({
        label: labels.language,
        control: selectControl({
          name: "language",
          label: labels.language,
          value: preferences.language,
          options: model.supportedLanguages.map((language) => ({ value: language.code, label: language.label }))
        })
      })}
      <div class="segmented-row">
        <span class="small-pill">${escapeHtml(labels.futureLanguages)}</span>
        ${model.futureLanguages.map((language) => `<span class="small-pill">${escapeHtml(language)}</span>`).join("")}
      </div>
    `
  });
}

function renderNotificationsSection(model) {
  const labels = model.labels;

  return sectionCard({
    iconName: "notifications",
    title: labels.notifications,
    content: notificationRows([
      { name: "prayerReminders", label: "prayerReminders" },
      { name: "dailyReadingReminder", label: "dailyReadingReminder" },
      { name: "saintReminder", label: "saintReminder" },
      { name: "feastReminder", label: "feastReminder" }
    ], model)
  });
}

function renderPrayerPreferencesSection(model) {
  const labels = model.labels;

  return sectionCard({
    iconName: "volunteer_activism",
    title: labels.prayerPreferences,
    content: prayerPreferenceRows([
      { name: "morningPrayerReminder", label: "morningPrayerReminder" },
      { name: "eveningPrayerReminder", label: "eveningPrayerReminder" },
      { name: "communionReminder", label: "communionReminder" }
    ], model)
  });
}

function renderAppSettingsSection(model) {
  const labels = model.labels;
  const preferences = model.preferences;

  return sectionCard({
    iconName: "settings_applications",
    title: labels.appSettings,
    content: `
      ${row({
        label: labels.offlineDownloads,
        description: preferences.offlineDownloads ? labels.enabled : labels.disabled,
        control: toggle({
          name: "offlineDownloads",
          label: labels.offlineDownloads,
          checked: preferences.offlineDownloads
        })
      })}
      ${row({
        label: labels.dataUsage,
        control: selectControl({
          name: "dataUsage",
          label: labels.dataUsage,
          value: preferences.dataUsage,
          options: [
            { value: "wifi", label: labels.wifiOnly },
            { value: "all", label: labels.wifiAndCellular }
          ]
        })
      })}
      ${row({
        label: labels.clearCache,
        control: action(labels.clearCache, "clear-cache", "delete")
      })}
      ${row({ label: labels.version, control: `<span class="meta-line">${escapeHtml(model.appVersion)}</span>` })}
      ${row({ label: labels.build, control: `<span class="meta-line">${escapeHtml(model.buildNumber)}</span>` })}
    `
  });
}

function renderAboutSection(model) {
  const labels = model.labels;

  return sectionCard({
    iconName: "info",
    title: labels.about,
    content: model.aboutPages.map((page) => action(page.label, page.action, "article")).join("")
  });
}

function renderSupportSection(model) {
  const labels = model.labels;

  return sectionCard({
    iconName: "help",
    title: labels.support,
    content: model.supportActions.map((supportAction) => action(supportAction.label, supportAction.action, supportAction.iconName)).join("")
  });
}
