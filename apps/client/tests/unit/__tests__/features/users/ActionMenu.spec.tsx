import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ActionMenu from "@client/web/components/features/users/profile/ActionMenu"

const createProps = (overrides = {}) => ({
  onLogout: jest.fn(),
  onEditProfile: jest.fn(),
  onListReports: jest.fn(),
  onListPayments: jest.fn(),
  mfaEnabled: false,
  onActivateMFA: jest.fn(),
  onDeactivateMFA: jest.fn(),
  ...overrides,
})

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      title: "Actions",
      label: "Profile Actions",
      "actions.editProfile": "Edit Profile",
      "actions.myReports": "My Reports",
      "actions.myPayments": "My Payments",
      "actions.activateMfa": "Enable MFA",
      "actions.deactivateMfa": "Disable MFA",
      "actions.logout": "Logout",
    })[key] ?? key,
}))

describe("ActionMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("opens the menu and displays all actions", async () => {
    const props = createProps()
    render(<ActionMenu {...props} />)

    await userEvent.click(screen.getByRole("button", { name: "Actions" }))

    expect(await screen.findByText("Edit Profile")).toBeInTheDocument()
    expect(await screen.findByText("My Reports")).toBeInTheDocument()
    expect(await screen.findByText("My Payments")).toBeInTheDocument()
    expect(await screen.findByText("Enable MFA")).toBeInTheDocument()
    expect(await screen.findByText("Logout")).toBeInTheDocument()
  })

  it("calls the correct handler when actions are clicked", async () => {
    const props = createProps()
    render(<ActionMenu {...props} />)

    await userEvent.click(screen.getByRole("button", { name: "Actions" }))

    const menuItems = await screen.findAllByRole("menuitem")
    const getItem = (label: string) =>
      menuItems.find((item) => item.textContent?.trim() === label)

    const itemEditProfile = getItem("Edit Profile")
    const itemReports = getItem("My Reports")
    const itemPayments = getItem("My Payments")
    const itemMFA = getItem("Enable MFA")
    const itemLogout = getItem("Logout")

    expect(itemEditProfile).toBeDefined()
    expect(itemReports).toBeDefined()
    expect(itemPayments).toBeDefined()
    expect(itemMFA).toBeDefined()
    expect(itemLogout).toBeDefined()

    await userEvent.click(itemEditProfile!)
    await userEvent.click(itemReports!)
    await userEvent.click(itemPayments!)
    await userEvent.click(itemMFA!)
    await userEvent.click(itemLogout!)

    expect(props.onEditProfile).toHaveBeenCalled()
  })

  it("calls deactivateMFA when MFA is enabled", async () => {
    const props = createProps({ mfaEnabled: true })
    render(<ActionMenu {...props} />)

    await userEvent.click(screen.getByRole("button", { name: "Actions" }))
    await userEvent.click(await screen.findByText("Disable MFA"))

    expect(props.onDeactivateMFA).toHaveBeenCalled()
  })
})
