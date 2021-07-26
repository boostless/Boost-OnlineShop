ESX = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

ESX.RegisterServerCallback('Boost-OnlineShop:GetInvItems', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    cb(xPlayer.getInventory())
end)

ESX.RegisterServerCallback('Boost-OnlineShop:IsAbleToBuy', function(source, cb, data)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer.getMoney() - tonumber(data.price) >= 0 then
        if xPlayer.canCarryItem(data.item, tonumber(data.amount)) then
            cb(true)
        else
            xPlayer.showNotification('Not enough space in inventory')
            cb(false)
        end
    else
        xPlayer.showNotification('You dont have enough money')
        cb(false)
    end
end)

ESX.RegisterServerCallback('Boost-OnlineShop:CanCarryItem', function(source, cb, data)
    local xPlayer = ESX.GetPlayerFromId(source)
    if xPlayer.canCarryItem(data.item, tonumber(data.amount)) then
        cb(true)       
    else
        xPlayer.showNotification('Not enough space in inventory')
        cb(false)
    end
end)

ESX.RegisterServerCallback('Boost-OnlineShop:GetShopItems', function(source, cb)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    MySQL.Async.fetchAll('SELECT * FROM onlineshop_items',{}, function(result)
        local sItems = {}
        local mItems = {}
        local data = {}
        if result[1] ~= nil then
            for i=1, #result do
                if result[i].owner == xPlayer.identifier then
                    table.insert(mItems, {name = result[i].item, label = xPlayer.getInventoryItem(result[i].item).label, amount = result[i].amount, seller = result[i].owner, price = result[i].price})
                else
                    table.insert(sItems, {name = result[i].item, label = xPlayer.getInventoryItem(result[i].item).label, amount = result[i].amount, seller = result[i].owner, price = result[i].price})
                end
            end
            data = {
                mItems = json.encode(mItems),
                sItems = json.encode(sItems)
            }
            cb(data)
        else
            data = {
                mItems = json.encode(mItems),
                sItems = json.encode(sItems)
            }
            cb(data)
        end
    end)
end)

RegisterServerEvent('Boost-OnlineShop:AddItemToShop', function(data)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    if not isCheating(_source, data, xPlayer) then
        MySQL.Async.execute('INSERT INTO onlineshop_items (owner, item, amount, price) VALUES (@owner, @item, @amount, @price)',{
            ['@owner'] = xPlayer.identifier,
            ['@item'] = data.item,
            ['@amount'] = tonumber(data.amount),
            ['@price'] = tonumber(data.price)
        })
        xPlayer.removeInventoryItem(tostring(data.item), tonumber(data.amount))
        TriggerClientEvent('Boost-OnlineShop:RefreshShop', _source)
    end
end)

RegisterServerEvent('Boost-OnlineShop:RemoveItemFromShop', function(data)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    MySQL.Async.execute('DELETE FROM onlineshop_items WHERE owner = @owner AND item = @item AND amount = @amount AND price = @price LIMIT 1',{
        ['@owner'] = xPlayer.identifier,
        ['@item'] = data.item,
        ['@amount'] = tonumber(data.amount),
        ['@price'] = tonumber(data.price)
    })
    xPlayer.addInventoryItem(data.item,  tonumber(data.amount))
end)

RegisterServerEvent('Boost-OnlineShop:BuyItemFromShop', function(data)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    if xPlayer.getMoney() - tonumber(data.price) >= 0 then
        MySQL.Async.execute('DELETE FROM onlineshop_items WHERE owner = @owner AND item = @item AND amount = @amount AND price = @price LIMIT 1',{
            ['@owner'] = data.seller,
            ['@item'] = data.item,
            ['@amount'] = tonumber(data.amount),
            ['@price'] = tonumber(data.price)
        })
        xPlayer.removeAccountMoney('money', tonumber(data.price))
        xPlayer.addInventoryItem(data.item, tonumber(data.amount))
        giveMoneyToSeller(data.seller, tonumber(data.price))
    end
end)


function isCheating(source, data, xPlayer)
    if xPlayer.getInventoryItem(data.item).count > 0 and xPlayer.getInventoryItem(data.item).count >= tonumber(data.amount) then
        return false
    else
        return true
    end
end

function giveMoneyToSeller(seller, amount)
    local xPlayer = ESX.GetPlayerFromIdentifier(seller)

    if xPlayer then
        xPlayer.addAccountMoney('money', amount)
    else
        local money = MySQL.Sync.fetchScalar('SELECT accounts FROM users WHERE identifier = @identifier', {['@identifier'] = seller})
        money = json.decode(money)
        for k,v in pairs(money) do 
            if k == 'money' then
                money = v
                break
            end
        end
        MySQL.Async.execute(string.format("UPDATE users SET accounts = REPLACE(accounts, '%s', '%s') WHERE identifier = @identifier", '"money":'..money, '"money":'..money+amount), {['@identifier'] = r_player}, function(result)
        end)
    end
end