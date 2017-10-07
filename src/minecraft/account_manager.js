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
		this._selectedUser = null;
		selectedUser = selectedUser || {};
		var account;
		for (var id in authDb) {
			if (utils.isMinecraftIdentifier(id)) {
				account = new Account(authDb[id]);
				account.setAccountId(id);
				if (account.isValid())
					this._accounts.push(account);
			}
		}
	}

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
}

// Export the module
module.exports = {AccountManager};