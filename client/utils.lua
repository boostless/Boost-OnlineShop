function isItemValid(item)
    for i=1, #Config.InvalidItems do
        if Config.InvalidItems[i] == item then
            return false
        end
    end
    return true
end

function OpenUi()
    SetNuiFocus(true, true)
    if not uiOpen then
        SendNUIMessage({
            ui = 'openui'
        })
        uiOpen = true
    end
end

function CloseUi()
    SetNuiFocus(false, false)
    if uiOpen then
        SendNUIMessage({
            ui = 'closeui'
        })
        uiOpen = false
    end
end

function RefreshSell()
    ESX.TriggerServerCallback('Boost-OnlineShop:GetInvItems', function(data) 
        local inv = data
        local t_inv = {}
        for k,v in pairs(inv) do
            if isItemValid(v.name) then
                table.insert(t_inv, {name = v.name, label = v.label, amount = v.count})
            end
        end
        SendNUIMessage({
            shop = 'setmitems',
            data = json.encode(t_inv)
        })
    end)
end

function RefreshShop()
    ESX.TriggerServerCallback('Boost-OnlineShop:GetShopItems', function(data) 
        SendNUIMessage({
            shop = 'refresh',
            sItems = data.sItems,
            mItems = data.mItems
        })
    end)
end
