// Access to a section follows the Roles screen: a role may use a section iff
// it has that (enabled) sidebar item. Superadmin always passes, so a newly
// added section is never locked away from the people who assign access.
// Must run after authenticate(), which eager-loads Role.SidebarItems.
function requireSidebarItem(...keys) {
  return function checkSidebarItem(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role === "superadmin") return next();

    const granted = (req.user.Role?.SidebarItems || []).some(
      (item) => item.isEnabled && keys.includes(item.key)
    );

    if (!granted) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
}

module.exports = requireSidebarItem;
