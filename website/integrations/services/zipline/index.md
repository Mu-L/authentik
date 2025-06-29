---
title: Integrate with Zipline
sidebar_label: Zipline
support_level: community
---

## What is Zipline

> Zipline is a self-hostable file upload server designed for easy file sharing, supporting tools like ShareX and Flameshot, with features such as simplified setup and extensive customization options.
>
> -- https://zipline.diced.sh/

## Preparation

The following placeholders are used in this guide:

- `zipline.company` is the FQDN of the Zipline installation.
- `authentik.company` is the FQDN of the authentik installation.

:::note
This documentation lists only the settings that you need to change from their default values. Be aware that any changes other than those explicitly mentioned in this guide could cause issues accessing your application.
:::

:::warning
This guide is only compatible with Zipline [version `v4.0.0`](https://github.com/diced/zipline/releases/tag/v4.0.0) or later.
:::

## authentik configuration

To support the integration of Zipline with authentik, you need to create an application/provider pair in authentik.

### Create an application and provider in authentik

1. Log in to authentik as an administrator and open the authentik Admin interface.
2. Navigate to **Applications** > **Applications** and click **Create with Provider** to create an application and provider pair. (Alternatively you can first create a provider separately, then create the application and connect it with the provider.)

- **Application**: Provide a descriptive name, an optional group for the type of application, the policy engine mode, and optional UI settings.
- **Choose a Provider type**: Select **OAuth2/OpenID Connect** as the provider type.
- **Configure the Provider**: Provide a name (or accept the auto-provided name), choose the authorization flow for this provider, and configure the following required settings:
    - Note the **Client ID** and **Client Secret** values because they will be required later.
    - Set a `Strict` redirect URI to `https://zipline.company/api/auth/oauth/oidc`.
    - Select any available signing key.
    - Under **Advanced Protocol Settings** > **Scopes**, add `authentik default OAuth Mapping: OpenID 'offline_access'` to the **Selected Scopes** list.
- **Configure Bindings** _(optional)_: Create a [binding](/docs/add-secure-apps/flows-stages/bindings/) (policy, group, or user) to manage the listing and access to applications on a user's **My applications** page.

3. Click **Submit** to save the new application and provider.

## Zipline configuration

1. From the **Zipline administrative dashboard**, navigate to **Administrator** > **Settings**, then scroll down until you reach the **OAuth** section.

2. In the **OpenID Connect** subsection, configure the following values:

- **OIDC Client ID**: Your Client ID from authentik
- **OIDC Client Secret**: Your Client Secret from authentik
- **OIDC Authorize URL**: `https://authentik.company/application/o/authorize/`
- **OIDC Token URL**: `https://authentik.company/application/o/token/`
- **OIDC Userinfo URL**: `https://authentik.company/application/o/userinfo/`

3. Then, click **Save**.

## Configuration verification

To verify integration with authentik, log out of Zipline by clicking your user icon in the top right and selecting **Logout**. A new button should now appear on the login page, allowing you to sign in with authentik.
