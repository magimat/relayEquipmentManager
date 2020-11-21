﻿import * as express from "express";
import * as extend from 'extend';
import { config } from "../../config/Config";
import { logger } from "../../logger/Logger";
import { utils, vMaps } from "../../boards/Constants";
import { cont, ConfigItem } from "../../boards/Controller";
import { PinDefinitions } from "../../pinouts/Pinouts";
import { Client } from "node-ssdp";
import { ConnectionBindings } from "../../connections/Bindings";
import { gpioPins } from "../../boards/GpioPins";
import { SpiAdcChips } from "../../spi-adc/SpiAdcChips";
export class StateRoute {
    public static initRoutes(app: express.Application) {
        app.get('/devices/all', (req, res) => {
            let devs = cont.analogDevices;
            let devices = [];
            for (let i = 0; i < cont.gpio.pins.length; i++) {
                let pin = cont.gpio.pins.getItemByIndex(i);
                devices.push({ type: 'gpio', isActive: pin.isActive, name: `GPIO Pin #${pin.headerId}-${pin.id}`, binding: `gpio:${pin.headerId}:${pin.id}`, category:'GPIO Pins' });
            }
            for (let i = 0; i < cont.spi0.channels.length; i++) {
                let chan = cont.spi0.channels.getItemByIndex(i);
                let dev = devs.find(elem => elem.id === chan.deviceId);
                devices.push({ type: 'spi', isActive: chan.isActive, name: `${typeof dev !== 'undefined' ? dev.name : 'Channel #0-' + chan.id}`, binding: `spi:0:${chan.id}`, category: typeof dev !== 'undefined' ? dev.category : 'unknown' });
            }
            for (let i = 0; i < cont.spi1.channels.length; i++) {
                let chan = cont.spi1.channels.getItemByIndex(i);
                let dev = devs.find(elem => elem.id === chan.deviceId);
                devices.push({ type: 'spi', isActive: chan.isActive, name: `${typeof dev !== 'undefined' ? dev.name : 'Channel #1-' + chan.id}`, binding: `spi:1:${chan.id}`, category: typeof dev !== 'undefined' ? dev.category : 'unknown' });
            }
            for (let i = 0; i < cont.i2c.buses.length; i++) {
                let bus = cont.i2c.buses.getItemByIndex(i);
                for (let j = 0; j < bus.devices.length; j++) {
                    let device = bus.devices.getItemByIndex(j);
                    let dev = devs.find(elem => elem.id === device.typeId);
                    devices.push({ type: 'i2c', isActive: device.isActive, name: device.name, binding: `i2c:${bus.id}:${device.id}`, category: typeof dev !== 'undefined' ? dev.category : 'unknown'  });
                }
            }
            return res.status(200).send(devices);
        });
    }
}