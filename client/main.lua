uiOpen = false

ESX = nil

Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
        Citizen.Wait(0)
    end
end)

Citizen.CreateThread(function()
    if Config.UseCommand then
        RegisterCommand('shop', function() 
            OpenShop()
        end, false)
    end


    
    blip = AddBlipForCoord(Config.Shop.location)
    SetBlipSprite(blip, Config.Shop.blip.id)
    SetBlipDisplay(blip, 4)
    SetBlipScale(blip, 1.0)
    SetBlipColour(blip, Config.Shop.blip.color)
    SetBlipAsShortRange(blip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString('Online Shop')
    EndTextCommandSetBlipName(blip)
end)

Citizen.CreateThread(function()
    while true do
        Wait(10)
        local playerPed = PlayerPedId()
        local coords = GetEntityCoords(playerPed)
        local distance = #(coords - Config.Shop.location)
        if distance < 5.0 then
            DrawMarker(Config.Shop.marker.type, Config.Shop.location.x, Config.Shop.location.y, Config.Shop.location.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, Config.Shop.marker.color.r, Config.Shop.marker.color.g, Config.Shop.marker.color.b, Config.Shop.marker.color.a, false, false, 2, nil, nil, false, false)
            if distance < 1.5 then
                if IsControlJustReleased(1, 38) and not uiOpen then
                    OpenShop()
                end
            end
        else
            Wait(100)
        end
    end

end)

function OpenShop()
    OpenUi()
    RefreshSell()
    RefreshShop()
end

RegisterNUICallback('CloseUi', function()
    CloseUi()
end)

RegisterNUICallback('AddItemToShop', function(data, cb)
    ESX.TriggerServerCallback('Boost-OnlineShop:GetItemAmount', function(count)
        if tonumber(data.amount) > count then
            ESX.ShowNotification("You don't have enought of this item")
            cb(false)
        else
            if tonumber(data.amount) >= 0 and tonumber(data.price) >= 0 then
                TriggerServerEvent('Boost-OnlineShop:AddItemToShop', data)
                cb(true)
            else
                ESX.ShowNotification('Invalid price or amount')
                cb(false)
            end
        end
    end, data.item)
end)

RegisterNUICallback('BuyItemFromShop', function(data, cb)
    ESX.TriggerServerCallback('Boost-OnlineShop:IsAbleToBuy', function(canBuy) 
        if canBuy then
            TriggerServerEvent('Boost-OnlineShop:BuyItemFromShop', data)
            cb(true)
        else
            cb(false)
        end
    end, data)
end)

RegisterNUICallback('RemoveItemFromShop', function(data, cb)
    ESX.TriggerServerCallback('Boost-OnlineShop:CanCarryItem', function(canCarry) 
        if canCarry then
            TriggerServerEvent('Boost-OnlineShop:RemoveItemFromShop', data)
            cb(true)
        else
            cb(false)
        end
    end, data)
end)

RegisterNetEvent('Boost-OnlineShop:RefreshShop', function(data)
    RefreshShop()
    RefreshSell()
end)

AddEventHandler('onResourceStop', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
      return
    end
    CloseUi()
end)
