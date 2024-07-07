export interface RecepcionProducto  {
    id: number;
    fechaHoraRecepcion: Date;
    producto: {
      id: number,
      codigo: string
    };
    proveedor: {
      id: number,
      identificacion: string
    };
    numeroFactura: string;
    cantidad: number;
    lote: string;
    registroInvima: string;
    fechaVencimiento: Date;
    estadoPresentacion: string;
    codigoProducto: string;
    identificacionProveedor: string;
  }