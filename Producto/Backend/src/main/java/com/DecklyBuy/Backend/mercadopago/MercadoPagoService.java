package com.DecklyBuy.Backend.mercadopago;

import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    public String crearOrdenDePago(Double totalCarrito) {
        try {
            // 1. El cliente que habla con la API de Mercado Pago
            PreferenceClient client = new PreferenceClient();

            // 2. Creamos el "ítem" que representa lo que el usuario va a pagar
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title("Carrito de Compra DecklyBuy")
                    .quantity(1)
                    .unitPrice(new BigDecimal(totalCarrito))
                    .currencyId("CLP") // Usa tu moneda local: CLP, MXN, ARS, COP, etc.
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(item);

            // 3. Armamos la petición de preferencia
            PreferenceRequest request = PreferenceRequest.builder()
                    .items(items)
                    .build();

            // 4. Enviamos la orden a Mercado Pago y nos devuelve la respuesta
            Preference preference = client.create(request);

            // 5. Retornamos la URL especial a la que el Front deberá redirigir al usuario
            return preference.getInitPoint();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error al generar el pago: " + e.getMessage();
        }
    }
}