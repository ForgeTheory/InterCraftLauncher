const {Account} = require("./account");
const utils     = require("../utils/utils");

class AccountManager
{
	/**
	 * Create a new account manager instance
	 * @param  {Json Object} authDb
	 * @param  {Json Object} selectedUser
	 */
	constructor(authDb, selectedUser) {
		this._accounts = [];
		this._selected = null;
		selectedUser = selectedUser || {};
		var account;
		for (var id in authDb) {
			if (utils.isMinecraftIdentifier(id)) {
				account = new Account(authDb[id]);
				account.setAccountId(id);
				if (account.isValid()) {
					this._accounts.push(account);
					if (selectedUser.account == account.accountId() &&
						account.hasProfile(selectedUser.profile)) {
						this._selected = {
							account: selectedUser.account,
							profile: selectedUser.profile
						}
					}
				}
			}
		}
	}

	// Methods -----------------------------------------------------------------

	/**
	 * Render the accounts into the authentication database form
	 * @return {Json Object}
	 */
	authDatabaseJson() {
		var result = {};
		for (var i = 0; i < this._accounts.length; i++)
			result[this._accounts[i].accountId()] = this._accounts[i].json();
		return result;
	}

	/**
	 * Render the selected user in json form
	 * @return {Json Object}
	 */
	selectedUserJson() {
		return {};
	}

	/**
	 * Get the selected account, or a default account if one exists
	 * @return {Account|Null}
	 */
	selectedAccount() {
		var account;
		if (this._selected) {
			if (account = this.account(this._selected.account))
				return account;
		}
		return this._accounts.length > 0 ? this._accounts[0] : null;
	}

	/**
	 * Get the selected profile
	 * @return {AccountProfile|Null}
	 */
	selectedProfile() {
		var account;
		var profile;
		account = this.selectedAccount();
		if (account) {
			if (account && this._selected &&
			    (profile = account.profile(this._selected.profile)))
				return profile;
		}
		return null;
	}

	// Accessors ---------------------------------------------------------------

	/**
	 * Get a specific account from the given account ID
	 * @param  {String} accountId
	 * @return {Account|Null}
	 */
	account(accountId) {
		for (var i = 0; i < this._accounts.length; i++)
			if (this._accounts[i].accountId() == accountId)
				return this._accounts[i];
		return null;
	}

	/**
	 * Get the list of accounts
	 * @return {Array<Account>}
	 */
	accounts() { return this._accounts; }

	// Mutators ----------------------------------------------------------------

	setSelectedProfile(profile) {
		profile = profile || {};
		if (profile instanceof AccountProfile) {

		} else if (profile instanceof Account) {

		} else if (utils.isMinecraftIdentifier(profile.account) &&
				   utils.isMinecraftIdentifier(profile.profile)) {
			var account;
			if (account = this.account(profile.account)) {
				this._selected = {
					account: account.accountId(),
					profile: account.defaultProfile(profile.profile).uuid()
				}
			}
		} else
			this._selected = null;
	}
}

// Export the module
module.exports = {AccountManager};
