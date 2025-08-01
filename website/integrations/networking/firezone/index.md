---
title: Integrate with Firezone
sidebar_label: Firezone
support_level: community
---

## What is Firezone

> Firezone is an open-source remote access platform built on WireGuard®, a modern VPN protocol that's 4-6x faster than OpenVPN.
>
> -- https://www.firezone.dev

## Preparation

The following placeholders are used in this guide:

- `firezone.company` is the FQDN of the Firezone installation.
- `authentik.company` is the FQDN of the authentik installation.

:::note
This documentation lists only the settings that you need to change from their default values. Be aware that any changes other than those explicitly mentioned in this guide could cause issues accessing your application.
:::

## authentik configuration

To support the integration of Firezone with authentik, you need to create an application/provider pair in authentik.

### Create an application and provider in authentik

1. Log in to authentik as an administrator and open the authentik Admin interface.
2. Navigate to **Applications** > **Applications** and click **Create with Provider** to create an application and provider pair. (Alternatively you can first create a provider separately, then create the application and connect it with the provider.)

- **Application**: provide a descriptive name, an optional group for the type of application, the policy engine mode, and optional UI settings.
- **Choose a Provider type**: select **OAuth2/OpenID Connect** as the provider type.
- **Configure the Provider**: provide a name (or accept the auto-provided name), the authorization flow to use for this provider, and the following required configurations.
    - Note the **Client ID**, **Client Secret**, and **slug** values because they will be required later.
    - Set a `Strict` redirect URI to <kbd>https://<em>firezone.company</em>/auth/oidc/authentik/callback/</kbd>.
    - Select any available signing key.
- **Configure Bindings** _(optional)_: you can create a [binding](/docs/add-secure-apps/flows-stages/bindings/) (policy, group, or user) to manage the listing and access to applications on a user's **My applications** page.

3. Click **Submit** to save the new application and provider.

## Firezone configuration

To configure OpenID Connect authentication with Firezone, navigate to **Settings** > **Security** of your Firezone installation and click **Add OpenID Connect Provider** under **Single Sign-On**.

:::info
In the event of a configuration errorm it is possible to re-enable local authentication, if previously disabled, by following instructions provided on [Firezone's troubleshooting documentation](https://www.firezone.dev/docs/administer/troubleshoot/#re-enable-local-authentication-via-cli).
:::info

Set the following values in the Firezone UI:

- **Config ID**: `authentik`
- **Label**: `authentik` (This is the label that is shown on the login page)
- **Scopes**: Keep the default value: `openid email profile`
- **Response type**: Keep the default value: `code`
- **Client ID**: Use the Client ID from authentik
- **Client Secret**: Use the Client Secret from authentik
- **Discovery Document URI**: `https://authentik.company/application/o/<application_slug>/.well-known/openid-configuration`
- **Redirect URI**: `https://firezone.company/auth/oidc/authentik/callback/`
- **Auth-create Users**: Turn this on

## Configuration verification

To verify that authentik is correctly set up with Firezone, navigate to your Firezone installation and click **authentik**. A successful login should redirect you to the main page of your installation.

## Resources

- [Firezone administration documentation on OpenID Connect authentication](https://www.firezone.dev/docs/authenticate/oidc/)
- [Firezone OIDC troubleshooting documentation](https://www.firezone.dev/docs/administer/troubleshoot/#re-enable-local-authentication-via-cli)
